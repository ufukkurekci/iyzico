import mongoose from "mongoose"
import Carts from "../db/carts"
import PaymentsSuccess from "../db/payment-success"
import PaymentsFailed from "../db/payment-failed"

export default CompletePayment = async(result) => {
    if (result?.status === "success") {
        await Carts.updateOne({
            _id: new mongoose.Types.ObjectId(result?.basketId)
        },
        {
            $set:{completed:true}
        })
        await PaymentsSuccess.create({
            status:result?.status,
            cardId:result?.basketId,
            conservationId:result?.conservationId,
            currency:result?.currency,
            paymentId:result?.paymentId,
            price:result?.price,
            paidPrice:result?.paidPrice,
            ItemTransactions:result?.ItemTransactions.map(item => {
                return {
                    itemId:item?.itemId,
                    paymentTrasactionId:item?.paymentTrasactionId,
                    price:item?.price,
                    paidPrice:item?.paidPrice
                }
            }),
            log:result

        })
    }
    else{
        await PaymentsFailed.create({
            status:result?.status,
            conservationId:result?.conservationId,
            errorCode:result?.errorCode,
            errorMessage:result?.errorMessage,
            log:result
        })
    }
}