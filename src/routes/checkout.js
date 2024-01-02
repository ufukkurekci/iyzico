import Iyzipay from "iyzipay";
import moment from "moment";
import Carts from "../db/carts";
import Users from "../db/users.js";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as Checkout from "../services/iyzico/methods/checkout.js";
import * as Cards from "../services/iyzico/methods/card.js";
import nanoid from "../utils/nanoid.js";
import { CompletePayment } from "../utils/payment.js";
import { completePayment } from "../services/iyzico/methods/threeds-payments.js";

export default (router) => {
    // checkoutform complete paymnet

    router.post("/checkout/complete/payment", async(req,res)=>{
        let result = await Checkout.getFormPayment({
            locale:"tr",
            conversationId:nanoid(),
            token:req.body.token
        });
        await completePayment(result);
        res.json(result);
    })

    // checkout form initialize
    router.post("/checkout/:cartId",Session,async(req,res) =>{

        if (!req.user?.cardUserKey) {
            throw new ApiError("No registered card avaiable",400,"cardUserKeyRequired");
        }

        if (!req.params?.cartId) {
            throw new ApiError("Cart id is req", 400 , "cardIdreq");
        }
         const cart = await Carts.findOne({
            _id:req.params?.cartId
         }).populate("buyer").populate("products");
        if (!cart) {
            throw new ApiError("Card not found", 404 , "cardNotFound");
        }
        if (cart.completed) {
            throw new ApiError("Card is completed", 400 , "cardCompleted");
        }


        
        const paidPrice = cart.products.map((product) => product.price).reduce((a,b) => a+b,0);

        const data ={
            locale:req.user.locale,
            conversationId: nanoid(),
            price:paidPrice,
            paidPrice:paidPrice, // paidprice ödenmmiş olan tutar /// price sepetteki tutar 
            currency:Iyzipay.CURRENCY.TRY,
            installments:'1',
            basketId:String(cart._id), // cart => sepet
            paymentChannel:Iyzipay.PAYMENT_CHANNEL.WEB,
            enabledInstallmens:[1,2,3,4,5,6],
            paymentGroup:Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl:`${process.env.END_POINT}/checkout/complete/payment`,
            ...req.user?.cardUserKey && {
                cardUserKey: req.user?.cardUserKey
            },
            buyer:{
                id:String(req.user._id),
                name:req.user?.name,
                surname:req.user?.surname,
                gsmNumber:req.user?.phoneNumber,
                email:req.user?.email,
                identityNumber:req.user?.identityNumber,
                lastLoginDate:moment(req.user?.updadeAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationDate:moment(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationAddress:req.user?.address,
                ip:req.user?.ip,
                city:req.user?.city,
                country:req.user?.country,
                zipCode:req.user?.zipCode
            },
            shippingAddress:{
                contactName: req.user?.name+ " " + req.user?.surname,
                city:req.user?.city,
                country:req.user?.country,
                address:req.user?.address,
                zipCode:req.user?.zipCode
            },
            billingAddress: {
                contactName: req.user?.name+ " " + req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
              },
            basketItems:cart.products.map((product,index) =>{
                return {
                    id:String(product?._id),
                    name:product?.name,
                    category1:product?.categories[0],
                    category2:product?.categories[1],
                    itemType:Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
                    price:product?.price
                }
            })
        }



        let result = await Checkout.initialize(data);
        const html = 
        `<!DOCTYPE html>
        <html lang="en">
        <head>
        <title>Pay</title>
        <meta charset="UTF-8" />
        </head>
        <body>
            ${result?.checkoutFormContent}
        </body>
        </html>`
        res.send(html);
    })
}