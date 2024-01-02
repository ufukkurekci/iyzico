"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
var _carts = _interopRequireDefault(require("../db/carts"));
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
var _Session = _interopRequireDefault(require("../middlewares/Session"));
var _payments = require("../services/iyzico/methods/payments");
var _payment = require("../utils/payment.js");
var _iyzipay = _interopRequireDefault(require("iyzipay"));
var _moment = _interopRequireDefault(require("moment"));
var _users = _interopRequireDefault(require("../db/users.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  // make payment with new card
  router.post("/payments/:cartId/with-new-card", _Session.default, async (req, res) => {
    const {
      card
    } = req.body;
    if (!card) {
      throw new _ApiError.default("Card is req", 400, "cardreq");
    }
    if (!req.params?.cartId) {
      throw new _ApiError.default("Card id is req", 400, "cardIdreq");
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
    card.registerCard = "0";
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
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      paymentCard: card,
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
    // console.log(data);

    // res.json({
    //     a:1
    // });

    let result = await (0, _payments.createPayment)(data);
    console.log(result);
    await (0, _payment.CompletePayment)(result);
    res.json(result);
  }),
  //  make payment and save card
  router.post("/payments/:cartId/with-new-card/register-card", _Session.default, async (req, res) => {
    const {
      card
    } = req.body;
    if (!card) {
      throw new _ApiError.default("Card is req", 400, "cardreq");
    }
    if (!req.params?.cartId) {
      throw new _ApiError.default("Card id is req", 400, "cardIdreq");
    }
    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");
    if (!cart) {
      throw new _ApiError.default("Card not found", 404, "cardNotFound");
    }
    if (cart.completed) {
      throw new _ApiError.default("Cart is completed", 400, "cartCompleted");
    }
    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
    }
    card.registerCard = "0";
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
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      paymentCard: card,
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
    let result = await (0, _payments.createPayment)(data);
    if (!req.user?.cardUserKey) {
      const user = await _users.default.findOne({
        _id: req.user?._id
      });
      user.cardUserKey = result?.cardUserKey;
      await user.save();
    }
    console.log(result);
    await (0, _payment.CompletePayment)(result);
    res.json(result);
  });
};
exports.default = _default;