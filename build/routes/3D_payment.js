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
var Payments_3D = _interopRequireWildcard(require("../services/iyzico/methods/threeds-payments.js"));
var Cards = _interopRequireWildcard(require("../services/iyzico/methods/card.js"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
var _payment = require("../utils/payment.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  router.post("/threeds/payments/complete", async (req, res) => {
    if (!req.body?.paymentId) {
      throw new _ApiError.default("Payment id is reqiured", 400, "paymentIdRequired");
    }
    if (req.body?.status != "success") {
      throw new _ApiError.default("Payment cant be started", 400, "paymentcantstarted");
    }
    const data = {
      locale: "tr",
      conversationId: (0, _nanoid.default)(),
      paymentId: req.body?.paymentId,
      conversationData: req.body?.conversationData
    };
    const result = await Payments_3D.completePayment(data);
    await (0, _payment.CompletePayment)(result);
    res.json(result).status(200);
  });

  // make payment with new card  3DS

  router.post("/threeds/payments/:cartId/with-new-card", _Session.default, async (req, res) => {
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
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
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
    let result = await Payments_3D.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    //await CompletePayment(result);
    res.send(html);
  }),
  // make a payment and saved cart 3DS
  router.post("/threeds/payments/:cartId/with-new-card/register-card", _Session.default, async (req, res) => {
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
    card.registerCard = "1";
    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
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
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
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
    let result = await Payments_3D.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  }),
  // make a payment with saved cart (use cardIndex) 3DS
  router.post("/threeds/payments/:cartId/:cardIndex/with-registered-card-index", _Session.default, async (req, res) => {
    const {
      cardIndex
    } = req.params;
    if (!cardIndex) {
      throw new _ApiError.default("cardIndex is req", 400, "cardIndexreq");
    }
    if (!req.user?.cardUserKey) {
      throw new _ApiError.default("No registered card avaiable", 400, "cardUserKeyRequired");
    }
    let cards = await Cards.getUserCards({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey
    });
    let index = parseInt(cardIndex);
    if (index >= cards.cardDetails?.length) {
      throw new _ApiError.default("card not found", 400, "cardnotfound");
    }
    const {
      cardToken
    } = cards?.cardDetails[index];
    const card = {
      cardToken,
      cardUserKey: req.user?.cardUserKey
    };
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
    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
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
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
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
    let result = await Payments_3D.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  }),
  // make a payment with saved cart (use cardToken) 3DS
  router.post("/threeds/payments/:cartId/with-registered-card-token", _Session.default, async (req, res) => {
    const {
      cardToken
    } = req.body;
    if (!cardToken) {
      throw new _ApiError.default("cardToken is req", 400, "cardTokenreq");
    }
    if (!req.user?.cardUserKey) {
      throw new _ApiError.default("No registered card avaiable", 400, "cardUserKeyRequired");
    }
    const card = {
      cardToken,
      cardUserKey: req.user?.cardUserKey
    };
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
    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
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
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
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
    let result = await Payments_3D.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  });
};
exports.default = _default;