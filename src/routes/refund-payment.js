import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as RefundaPayments from "../services/iyzico/methods/refund-payment";
import nanoid from "../utils/nanoid";
import PaymentsSuccess from "../db/payment-success";
import Iyzipay from "iyzipay";

const reasonEnum = [
    "double_payment",
    "buyer_request",
    "fraud",
    "other"
];

export default (router) =>{
    router.post("/payments/:paymentTransactionId/refund",Session, async (req,res) => {
        const {paymentTransactionId} = req.params;
        const reasonObj = {};
        const {reason,description} = req.body;

        if (!paymentTransactionId) {
            throw new ApiError("PaymentTransationId is required",400,"paymentTransactionIdReq");
        }
        if (reason && description) {
            if (!reasonEnum.includes(reason)) {
                throw new ApiError("PaymentTransationId is required",400,"paymentTransactionIdReq");
            }
            reasonObj.reason = reason;
            reasonObj.description = description;
        }
        const payment = await PaymentsSuccess.findOne({
            "itemTransactions.paymentTransactionId": paymentTransactionId
        });

        const curremtItemTransation = payment.itemTransactions.find((itemTransaction,index) => {
            return itemTransaction.paymentTransactionId === paymentTransactionId
        })

        const data = {
            locale:req.body.locale,
            conversationId:nanoid(),
            paymentTransactionId:curremtItemTransation?.paymentTransactionId,
            price:req.body?.refundPrice || curremtItemTransation?.paidPrice,
            currency:Iyzipay.CURRENCY.TRY,
            ip:req.user?.ip,
            ...reasonObj
        }
        const result = await RefundaPayments.refundPayments(data);

        res.json(result).status(200);


    })
}