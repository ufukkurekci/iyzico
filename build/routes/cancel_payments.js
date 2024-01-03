"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
var _Session = _interopRequireDefault(require("../middlewares/Session"));
var CancelPayment = _interopRequireWildcard(require("../services/iyzico/methods/cancelPayment"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid"));
var _paymentSuccess = _interopRequireDefault(require("../db/payment-success"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];
var _default = router => {
  // Cancel whole payments
  router.post("/payments/:paymentSuccessId/cancel", _Session.default, async (req, res) => {
    const {
      reason,
      description
    } = req.body;
    const {
      paymentSuccessId
    } = req.params;
    const reasonObj = {};
    if (!paymentSuccessId) {
      throw new _ApiError.default("PaymentsuccessId is req", 400, "paymentsuccessIdreq");
    }
    if (reason && description) {
      if (!reasonEnum.includes(reason)) {
        throw new _ApiError.default("Invalid cancel payment reason", 400, "invalidcancelreason");
      }
      reasonObj.reason = reason;
      reasonObj.description = description;
    }
    const payment = await _paymentSuccess.default.findOne({
      _id: new _mongoose.default.Types.ObjectId(paymentSuccessId)
    });
    const data = {
      locale: req.user?.locale,
      conversationId: (0, _nanoid.default)(),
      paymentId: payment?.paymentId,
      ip: req.user?.ip,
      ...reasonObj
    };
    const result = await CancelPayment.cancelPayment(data);
    res.json(result);
  });
};
exports.default = _default;