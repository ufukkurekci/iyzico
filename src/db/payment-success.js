import mongoose from "mongoose";
import nanoid from "../utils/nanoid";
import Products from "./products";

const {Schema} = mongoose;
const {ObjectId} = Schema.Types;


const ItemTransactionSchema = new Schema({
    uild:{
        type: String,
        default: nanoid(),
        unique: true,
        required: true
    },
    ItemId:{
        type: ObjectId,
        required: true,
        ref: Products
    },
    paymentTransactionId:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    paidPrice:{
        type: Number,
        required: true
    },
})


const PaymentSuccessSchema = new Schema({
    uild:{
        type: String,
        default: nanoid(),
        unique: true,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum:["success"]
    },
    cardId:{
        type: ObjectId,
        required: true,
        ref:Carts
    },
    conservationId:{
        type: String,
        required: true
    },
    currency:{
        type: String,
        required: true,
        enum:["TRY","USD","EUR"]
    },
    paymentTransactionId:{
        type: String,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        required: true
    },
    paidPrice:{
        type: Number,
        required: true
    },
    ItemTransactions:{
        type: [ItemTransactionSchema]
    },
    log:{
        type: Schema.Types.Mixed,
        required: true
    },

},
{
    _id:true,
    collection: "payment-success",
    timestamps: true,
    toJSON:{
        transform: (doc,ret) =>{
            delete ret.__v;
            return {
                ...ret
            }
        }
    }
})

const PaymentsSuccess = mongoose.model("PaymentSuccess",PaymentSuccessSchema);

export default PaymentsSuccess;