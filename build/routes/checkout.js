"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _iyzipay = _interopRequireDefault(require("iyzipay"));
var _moment = _interopRequireDefault(require("moment"));
var _carts = _interopRequireDefault(require("../db/carts"));
var _users = _interopRequireDefault(require("../db/users.js"));
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
var _Session = _interopRequireDefault(require("../middlewares/Session"));
var Checkout = _interopRequireWildcard(require("../services/iyzico/methods/checkout.js"));
var Cards = _interopRequireWildcard(require("../services/iyzico/methods/card.js"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
var _payment = require("../utils/payment.js");
var _threedsPayments = require("../services/iyzico/methods/threeds-payments.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  // checkoutform complete paymnet

  router.post("/checkout/complete/payment", async (req, res) => {
    let result = await Checkout.getFormPayment({
      locale: "tr",
      conversationId: (0, _nanoid.default)(),
      token: req.body.token
    });
    await (0, _threedsPayments.completePayment)(result);
    res.json(result);
  });

  // checkout form initialize
  router.post("/checkout/:cartId", _Session.default, async (req, res) => {
    if (!req.user?.cardUserKey) {
      throw new _ApiError.default("No registered card avaiable", 400, "cardUserKeyRequired");
    }
    if (!req.params?.cartId) {
      throw new _ApiError.default("Cart id is req", 400, "cardIdreq");
    }
    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");
    if (!cart) {
      throw new _ApiError.default("Card not found", 404, "cardNotFound");
    }
    if (cart.completed) {
      throw new _ApiError.default("Card is completed", 400, "cardCompleted");
    }
    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      // paidprice ödenmmiş olan tutar /// price sepetteki tutar 
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: '1',
      basketId: String(cart._id),
      // cart => sepet
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      enabledInstallmens: [1, 2, 3, 4, 5, 6],
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/checkout/complete/payment`,
      ...(req.user?.cardUserKey && {
        cardUserKey: req.user?.cardUserKey
      }),
      buyer: {
        id: String(req.user._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updadeAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        zipCode: req.user?.zipCode
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, index) => {
        return {
          id: String(product?._id),
          name: product?.name,
          category1: product?.categories[0],
          category2: product?.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await Checkout.initialize(data);
    const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <title>Pay</title>
        <meta charset="UTF-8" />
        </head>
        <body>
            ${result?.checkoutFormContent}
        </body>
        </html>`;
    res.send(html);
  });
};
exports.default = _default;