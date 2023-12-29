"use strict";

var _iyzipay = _interopRequireDefault(require("iyzipay"));
var Cards = _interopRequireWildcard(require("./methods/card"));
var Installments = _interopRequireWildcard(require("./methods/installments"));
var Payments = _interopRequireWildcard(require("./methods/payments"));
var _nanoid = _interopRequireDefault(require("../../utils/nanoid"));
var Logs = _interopRequireWildcard(require("../../utils/logs"));
var Payments3DS = _interopRequireWildcard(require("./methods/threeds-payments"));
var Checkouts = _interopRequireWildcard(require("./methods/checkout"));
var CancelPayments = _interopRequireWildcard(require("./methods/cancelPayment"));
var RefundPayments = _interopRequireWildcard(require("./methods/refund-payment"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const createUserAndCards = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    externalId: (0, _nanoid.default)(),
    card: {
      cardAlias: "my_credit_card",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("3-card_created", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("3-card_not_created", err);
  });
};

// createUserAndCards();

/* ---------------
add new card 
 ----------------- */

const createACardForUser = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    externalId: (0, _nanoid.default)(),
    cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes=",
    card: {
      cardAlias: "my_credit_card",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("2-card_added", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("2-card_not_added", err);
  });
};
const readACardForUser = () => {
  Cards.getUserCards({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes="
  }).then(result => {
    console.log(result);
    Logs.logFile("3-card_info", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("3-card_not_info", err);
  });
};
// readACardForUser();

/* ---------------
kart silme
 ----------------- */
const deleteACardForUser = () => {
  Cards.deleteUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes=",
    cardToken: "j6yE0InDVDMUsP4Xh7dzespstak="
  }).then(result => {
    console.log(result);
    Logs.logFile("4-card_deleted", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("4-card_not_deleted", err);
  });
};

// deleteACardForUser();

/* ---------------
installment methodu ( taksit yapar)
 ----------------- */

const checkInstallments = () => {
  return Installments.checkInstallment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    binNumber: "55287900",
    price: "10000"
  }).then(result => {
    console.log(result);
    Logs.logFile("5-card_installment_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("5-card_installment_fail", err);
  });
};

// checkInstallments();

/* ---------------
payment method
 ----------------- */

const createPayment = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "350",
    // ödeme kırılımı totali 
    paidPrice: "350",
    // asıl ödenecek olan tutar
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basket: (0, _nanoid.default)(),
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0"
    },
    buyer: {
      id: "346900",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905554445454",
      email: "email@email.com",
      identityNumber: "343556655678",
      lastLoginDate: "2020-10-05 12:12:12",
      registrationDate: "2020-10-05 12:12:12",
      registrationAddress: "ornek adres ornek adres ornek adres",
      ip: "85.24.78.112",
      city: "Ankara",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    basketItems: [{
      id: "ATS2",
      name: "Iphone",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 160
    }, {
      id: "ATS3",
      name: "Samsung",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "ATS4",
      name: "Nokia",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("6-payment_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("6-payment_fail", err);
  });
};

// createPayment();

/* ---------------
ödeme yaparken kredi kartınıda kaydet.
 ----------------- */

const createPaymentAndSaveCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "350",
    // ödeme kırılımı totali 
    paidPrice: "350",
    // asıl ödenecek olan tutar
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basket: (0, _nanoid.default)(),
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes=",
      cardAlias: "My_credit_card_after_payment",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "1"
    },
    buyer: {
      id: "346900",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905554445454",
      email: "email@email.com",
      identityNumber: "343556655678",
      lastLoginDate: "2020-10-05 12:12:12",
      registrationDate: "2020-10-05 12:12:12",
      registrationAddress: "ornek adres ornek adres ornek adres",
      ip: "85.24.78.112",
      city: "Ankara",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    basketItems: [{
      id: "ATS2",
      name: "Iphone",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 160
    }, {
      id: "ATS3",
      name: "Samsung",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "ATS4",
      name: "Nokia",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("7-payment_with_save_card_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("7-payment_with_save_card_fail", err);
  });
};

// createPaymentAndSaveCard();

/* ---------------
// paymet with saved card.
 ----------------- */
const createPaymentWithSavedCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "5000",
    // ödeme kırılımı totali 
    paidPrice: "5000",
    // asıl ödenecek olan tutar
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basket: (0, _nanoid.default)(),
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes=",
      cardToken: "oCuMmNo/VynBUBrqT9A2ukq+Xhg="
    },
    buyer: {
      id: "346900",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905554445454",
      email: "email@email.com",
      identityNumber: "343556655678",
      lastLoginDate: "2020-10-05 12:12:12",
      registrationDate: "2020-10-05 12:12:12",
      registrationAddress: "ornek adres ornek adres ornek adres",
      ip: "85.24.78.112",
      city: "Ankara",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    basketItems: [{
      id: "ATS2",
      name: "Iphone",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 2600
    }, {
      id: "ATS3",
      name: "Samsung",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 1300
    }, {
      id: "ATS4",
      name: "Nokia",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 1100
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("8-payment_with_saved_card_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("8-payment_with_saved_card_fail", err);
  });
};

// createPaymentWithSavedCard();

// createPaymentAndSaveCard();
// readACardForUser();

/* ---------------
 3D secure payment
 ----------------- */

const initialize3DSPayments = () => {
  Payments3DS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "350",
    // ödeme kırılımı totali 
    paidPrice: "350",
    // asıl ödenecek olan tutar
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basket: (0, _nanoid.default)(),
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "htpps://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "0"
    },
    buyer: {
      id: "346900",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905554445454",
      email: "email@email.com",
      identityNumber: "343556655678",
      lastLoginDate: "2020-10-05 12:12:12",
      registrationDate: "2020-10-05 12:12:12",
      registrationAddress: "ornek adres ornek adres ornek adres",
      ip: "85.24.78.112",
      city: "Ankara",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    basketItems: [{
      id: "ATS2",
      name: "Iphone",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 160
    }, {
      id: "ATS3",
      name: "Samsung",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "ATS4",
      name: "Nokia",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("9-3d_payment_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("9-3d_payment_fail", err);
  });
};

//  initialize3DSPayments();

const complete3DSPayment = () => {
  Payments3DS.completePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "21405640",
    conversationData: "conservation data"
  }).then(result => {
    console.log(result);
    Logs.logFile("10-3d_payment_completed_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("10-3d_payment_completed_fail", err);
  });
};

//complete3DSPayment();

/* ---------------
 3D secure payment with save card
 ----------------- */
const initialize3DSPaymentsWithSaveCard = () => {
  Payments3DS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "350",
    // ödeme kırılımı totali 
    paidPrice: "350",
    // asıl ödenecek olan tutar
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basket: (0, _nanoid.default)(),
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "htpps://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes=",
      cardToken: "oCuMmNo/VynBUBrqT9A2ukq+Xhg="
    },
    buyer: {
      id: "346900",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905554445454",
      email: "email@email.com",
      identityNumber: "343556655678",
      lastLoginDate: "2020-10-05 12:12:12",
      registrationDate: "2020-10-05 12:12:12",
      registrationAddress: "ornek adres ornek adres ornek adres",
      ip: "85.24.78.112",
      city: "Ankara",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    basketItems: [{
      id: "ATS2",
      name: "Iphone",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 160
    }, {
      id: "ATS3",
      name: "Samsung",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "ATS4",
      name: "Nokia",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("11-3ds_saved_credit_card_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("11-3ds_saved_credit_card_fail", err);
  });
};

//  initialize3DSPaymentsWithSaveCard();

const initialize3DSPaymentsWithNewCardAndRegister = () => {
  Payments3DS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "350",
    // ödeme kırılımı totali 
    paidPrice: "350",
    // asıl ödenecek olan tutar
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basket: (0, _nanoid.default)(),
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "htpps://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes=",
      cardAlias: "My_credit_card_after_payment",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: "1"
    },
    buyer: {
      id: "346900",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905554445454",
      email: "email@email.com",
      identityNumber: "343556655678",
      lastLoginDate: "2020-10-05 12:12:12",
      registrationDate: "2020-10-05 12:12:12",
      registrationAddress: "ornek adres ornek adres ornek adres",
      ip: "85.24.78.112",
      city: "Ankara",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    basketItems: [{
      id: "ATS2",
      name: "Iphone",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 160
    }, {
      id: "ATS3",
      name: "Samsung",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "ATS4",
      name: "Nokia",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("11-3ds_saved_credit_card_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("11-3ds_saved_credit_card_fail", err);
  });
};

//  initialize3DSPaymentsWithNewCardAndRegister();
// readACardForUser();

/* ---------------
checkout Form method
 ----------------- */

const initializeCheckoutForm = () => {
  Checkouts.initialize({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "350",
    // ödeme kırılımı totali 
    paidPrice: "350",
    // asıl ödenecek olan tutar
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basket: (0, _nanoid.default)(),
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "htpps://localhost/api/checkout/complete/payment",
    cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes=",
    enableInstallments: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    buyer: {
      id: "346900",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905554445454",
      email: "email@email.com",
      identityNumber: "343556655678",
      lastLoginDate: "2020-10-05 12:12:12",
      registrationDate: "2020-10-05 12:12:12",
      registrationAddress: "ornek adres ornek adres ornek adres",
      ip: "85.24.78.112",
      city: "Ankara",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Ankara",
      country: "Turkey",
      address: "ornek adres ornek adres ornek adres",
      zipCode: "34732"
    },
    basketItems: [{
      id: "ATS2",
      name: "Iphone",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 160
    }, {
      id: "ATS3",
      name: "Samsung",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "ATS4",
      name: "Nokia",
      category1: "Phones",
      category1: "Phones",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("12-checkout_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("12-checkout_fail", err);
  });
};

//  initializeCheckoutForm();

// checkout form kontrol methodu
const getFormPayment = () => {
  Checkouts.getFormPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    token: "bf76d0ce-e17f-4be9-862b-04f07a29e1e4"
  }).then(result => {
    console.log(result);
    Logs.logFile("13-checkout_getdetails_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("13-checkout_getdetails_fail", err);
  });
};

// getFormPayment();

//payment cancel method 

const cancelPayment = () => {
  CancelPayments.cancelPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "21405649",
    ip: "85.24.78.112"
  }).then(result => {
    console.log(result);
    Logs.logFile("14-cancelPayment_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("14-cancelPayment_fail", err);
  });
};

// cancelPayment();

const cancelPaymentWithReason = () => {
  CancelPayments.cancelPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "21391437",
    ip: "85.24.78.112",
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Canceled by user request."
  }).then(result => {
    console.log(result);
    Logs.logFile("15_user_request_cancelpayment_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("15_user_request_cancelpayment_fail", err);
  });
};

// cancelPaymentWithReason();

// createPaymentWithSavedCard();

// refund payments 

const refundPayment = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransactionId: "23367304",
    ip: "85.24.78.112",
    price: "10"
  }).then(result => {
    console.log(result);
    Logs.logFile("16_refund_payment_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("16_refund_payment_fail", err);
  });
};

// refundPayment();

// refund with user request
const refundPaymentWithReason = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransactionId: "23367304",
    ip: "85.24.78.112",
    price: "50",
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Canceled by user request."
  }).then(result => {
    console.log(result);
    Logs.logFile("17_refund_payment_with_request_success", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("17_refund_payment_with_request_fail", err);
  });
};

// refundPaymentWithReason();