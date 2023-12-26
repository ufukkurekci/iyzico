import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as Installments from "../services/iyzico/methods/installments";
import nanoid from "../utils/nanoid";
import Carts from "../db/carts";
import mongoose from "mongoose";



export default (router) =>{
    router.post("/installments",Session, async(req,res)=>{
        const {binNumber, price} = req.body;
        if (!binNumber || !price) {
            throw new ApiError("Missing parameters",400,"missparam");
        }
        const result = await Installments.checkInstallment({
            locale: req.user?.locale,
            conversationId:nanoid(),
            binNumber:binNumber,
            price:price
        })
        res.json(result);
    })
    // installment control by basket(cart) total price 
    router.post("/installments/:cartId",Session, async(req,res) => {
        const binNumber = req.body.binNumber;
        const cartId = req.params.cartId
        if (!cartId) {
            throw new ApiError("cartId is required",400,"cardidreq");
        }
        const cart = await Carts.findOne({
            _id: new mongoose.Types.ObjectId(cartId)
        }).populate("products",{
            _id:1,
            price:1
        })

        const price = cart.products.map((product) => product.price).reduce((a,b) => a+b,0);
        if (!binNumber || !price) {
            throw new ApiError("Missing parameters",400,"missparam");
        }

        const result = await Installments.checkInstallment({
            locale: req.user?.locale,
            conversationId:nanoid(),
            binNumber:binNumber,
            price:price
        })
        
        res.json(result);
    })
}
