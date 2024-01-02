import mongoose from "mongoose";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as CancelPayment from "../services/iyzico/methods/cancelPayment";
import nanoid from "../utils/nanoid";
import PaymentsSuccess from "../db/payment-success";

const reasonEnum = [
    "double_payment",
    "buyer_request",
    "fraud",
    "other"
];

export default (router) => {
    // Cancel whole payments
    router.post("/payments/:paymentSuccessId/cancel",Session,async(req,res)=>{
        const {reason, description} = req.body;
        const {paymentSuccessId} = req.params;
        const reasonObj = {};

        if (!paymentSuccessId) {
            throw new ApiError("PaymentsuccessId is req",400,"paymentsuccessIdreq"); 
        }
        if (reason && description) {
            if (!reasonEnum.includes(reason)) {
                throw new ApiError("Invalid cancel payment reason",400,"invalidcancelreason"); 
            }
            reasonObj.reason = reason;
            reasonObj.description = description;
        }
        const payment = await PaymentsSuccess.findOne({_id: new mongoose.Types.ObjectId(paymentSuccessId)});
        const data = {
            locale:req.user?.locale,
            conversationId:nanoid(),
            paymentId:payment?.paymentId,
            ip:req.user?.ip,
            ...reasonObj
        }

        const result = await CancelPayment.cancelPayment(data);
        res.json(result);

    })
}

