"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _test = _interopRequireDefault(require("./test"));
var _users = _interopRequireDefault(require("./users"));
var _cards = _interopRequireDefault(require("./cards"));
var _payment = _interopRequireDefault(require("./payment"));
var _installment = _interopRequireDefault(require("./installment"));
var _D_payment = _interopRequireDefault(require("./3D_payment"));
var _checkout = _interopRequireDefault(require("./checkout"));
var _cancel_payments = _interopRequireDefault(require("./cancel_payments"));
var _refundPayment = _interopRequireDefault(require("./refund-payment"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = [_test.default, _users.default, _cards.default, _installment.default, _payment.default, _D_payment.default, _checkout.default, _cancel_payments.default, _refundPayment.default];