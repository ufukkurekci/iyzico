"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompletePayment = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _carts = _interopRequireDefault(require("../db/carts"));
var _paymentSuccess = _interopRequireDefault(require("../db/payment-success"));
var _paymentFailed = _interopRequireDefault(require("../db/payment-failed"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CompletePayment = async result => {
  if (result?.status === "success") {
    await _carts.default.updateOne({
      _id: new _mongoose.default.Types.ObjectId(result?.basketId)
    }, {
      $set: {
        completed: true
      }
    });
    await _paymentSuccess.default.create({
      status: result?.status,
      cardId: result?.basketId,
      conversationId: result?.conversationId,
      currency: result?.currency,
      paymentId: result?.paymentId,
      price: result?.price,
      paidPrice: result?.paidPrice,
      itemTransactions: result?.itemTransactions.map(item => {
        return {
          itemId: item?.itemId,
          paymentTransactionId: item?.paymentTransactionId,
          price: item?.price,
          paidPrice: item?.paidPrice
        };
      }),
      log: result
    });
  } else {
    await _paymentFailed.default.create({
      status: result?.status,
      conversationId: result?.conversationId,
      errorCode: result?.errorCode,
      errorMessage: result?.errorMessage,
      log: result
    });
  }
};
exports.CompletePayment = CompletePayment;