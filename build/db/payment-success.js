"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid"));
var _products = _interopRequireDefault(require("./products"));
var _carts = _interopRequireDefault(require("./carts"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  Schema
} = _mongoose.default;
const {
  ObjectId
} = Schema.Types;
const ItemTransactionSchema = new Schema({
  uild: {
    type: String,
    default: (0, _nanoid.default)(),
    unique: true,
    required: false
  },
  itemId: {
    type: ObjectId,
    required: true,
    ref: _products.default
  },
  paymentTransactionId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  paidPrice: {
    type: Number,
    required: true
  }
});
const PaymentSuccessSchema = new Schema({
  uild: {
    type: String,
    default: (0, _nanoid.default)(),
    unique: true,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["success"]
  },
  cardId: {
    type: ObjectId,
    required: true,
    ref: _carts.default
  },
  conversationId: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ["TRY", "USD", "EUR"]
  },
  price: {
    type: Number,
    required: true
  },
  paidPrice: {
    type: Number,
    required: true
  },
  itemTransactions: {
    type: [ItemTransactionSchema]
  },
  log: {
    type: Schema.Types.Mixed,
    required: true
  }
}, {
  _id: true,
  collection: "payment-success",
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return {
        ...ret
      };
    }
  }
});
const PaymentsSuccess = _mongoose.default.model("PaymentSuccess", PaymentSuccessSchema);
var _default = exports.default = PaymentsSuccess;