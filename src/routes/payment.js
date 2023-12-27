import Carts from "../db/carts";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session"

export default (router) => {
    router.post("/payments/:cartId/with-new-card",Session, async(req,res) => {
        const {card} = req.body.card;

        if (!card) {
            throw new ApiError("Card is req", 400 , "cardreq");
        } 

        if (!req.params?.cartId) {
            throw new ApiError("Card id is req", 400 , "cardIdreq");
        }
         const cart = await Carts.findOne({
            _id:req.params?.cartId
         }).populate("buyer").populate("products");
        
    })
}