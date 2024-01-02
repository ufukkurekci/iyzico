import Iyzipay from "iyzipay";
import moment from "moment";
import Carts from "../db/carts";
import Users from "../db/users.js";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as Payments_3D from "../services/iyzico/methods/threeds-payments.js";
import * as Cards from "../services/iyzico/methods/card.js";
import nanoid from "../utils/nanoid.js";
import { CompletePayment } from "../utils/payment.js";


export default (router) => {
    router.post("/threeds/payments/complete",async(req,res)=>{
        if (!req.body?.paymentId) {
            throw new ApiError("Payment id is reqiured",400,"paymentIdRequired");
        }
        if (req.body?.status != "success") {
            throw new ApiError("Payment cant be started",400,"paymentcantstarted");
        }

        const data = {
            locale:"tr",
            conversationId:nanoid(),
            paymentId:req.body?.paymentId,
            conversationData:req.body?.conversationData
        }

        const result = await Payments_3D.completePayment(data);

        await CompletePayment(result);
        res.json(result).status(200);
    })

   // make payment with new card  3DS

    router.post("/threeds/payments/:cartId/with-new-card",Session, async(req,res) => {
        const {card} = req.body;

        if (!card) {
            throw new ApiError("Card is req", 400 , "cardreq");
        } 

        if (!req.params?.cartId) {
            throw new ApiError("Card id is req", 400 , "cardIdreq");
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
        card.registerCard = "0";
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
            paymentGroup:Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl:`${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard:card,
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



        let result = await Payments_3D.initializePayment(data);
        const html = Buffer.from(result?.threeDSHtmlContent,'base64').toString();
        //await CompletePayment(result);
        res.send(html);



    }),

    // make a payment and saved cart 3DS
    router.post("/threeds/payments/:cartId/with-new-card/register-card",Session, async(req,res) => {
        const {card} = req.body;

        if (!card) {
            throw new ApiError("Card is req", 400 , "cardreq");
        } 

        if (!req.params?.cartId) {
            throw new ApiError("Card id is req", 400 , "cardIdreq");
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
        card.registerCard = "1";

        if (req.user?.cardUserKey) {
            card.cardUserKey = req.user?.cardUserKey;
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
            paymentGroup:Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl:`${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard:card,
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



        let result = await Payments_3D.initializePayment(data);
        const html = Buffer.from(result?.threeDSHtmlContent,'base64').toString();
        res.send(html);



    }),

    // make a payment with saved cart (use cardIndex) 3DS
    router.post("/threeds/payments/:cartId/:cardIndex/with-registered-card-index",Session, async(req,res) => {
        const {cardIndex} = req.params;

        if (!cardIndex) {
            throw new ApiError("cardIndex is req", 400 , "cardIndexreq");
        } 

        if (!req.user?.cardUserKey) {
            throw new ApiError("No registered card avaiable",400,"cardUserKeyRequired");
        }

        let cards = await Cards.getUserCards({
            locale: req.user.locale,
            conversationId: nanoid(),
            cardUserKey:req.user?.cardUserKey
        })
        let index = parseInt(cardIndex);

        if (index >= cards.cardDetails?.length) {
            throw new ApiError("card not found",400,"cardnotfound");
        }
        const {cardToken} = cards?.cardDetails[index];
        const card = {
            cardToken,
            cardUserKey:req.user?.cardUserKey
        };
        if (!req.params?.cartId) {
            throw new ApiError("Card id is req", 400 , "cardIdreq");
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

        if (req.user?.cardUserKey) {
            card.cardUserKey = req.user?.cardUserKey;
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
            paymentGroup:Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl:`${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard:card,
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



        let result = await Payments_3D.initializePayment(data);
        const html = Buffer.from(result?.threeDSHtmlContent,'base64').toString();
        res.send(html);



    }),

    // make a payment with saved cart (use cardToken) 3DS
    router.post("/threeds/payments/:cartId/with-registered-card-token",Session, async(req,res) => {
        const {cardToken} = req.body;

        if (!cardToken) {
            throw new ApiError("cardToken is req", 400 , "cardTokenreq");
        } 

        if (!req.user?.cardUserKey) {
            throw new ApiError("No registered card avaiable",400,"cardUserKeyRequired");
        }
        const card = {
            cardToken,
            cardUserKey:req.user?.cardUserKey
        };
        if (!req.params?.cartId) {
            throw new ApiError("Card id is req", 400 , "cardIdreq");
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

        if (req.user?.cardUserKey) {
            card.cardUserKey = req.user?.cardUserKey;
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
            paymentGroup:Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl:`${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard:card,
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



        let result = await Payments_3D.initializePayment(data);
        const html = Buffer.from(result?.threeDSHtmlContent,'base64').toString();
        res.send(html);



    })
}