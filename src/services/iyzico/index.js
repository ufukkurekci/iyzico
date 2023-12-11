import Iyzipay from "iyzipay";
import * as Cards from "./methods/card";
import * as Installments from "./methods/installments";
import * as Payments from "./methods/payments";
import nanoid  from "../../utils/nanoid";
import * as Logs from "../../utils/logs";



const createUserAndCards = ()=>{
    Cards.createUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        email:"ufukkurekci@gmail.com",
        externalId:nanoid(),
        card:{
            cardAlias:"my_credit_card",
            cardHolderName:"John Doe",
            cardNumber:"5528790000000008",
            expireMonth:"12",
            expireYear:"2030"
        }
    }).then((result) =>{
        console.log(result);
        Logs.logFile("3-card_created",result)
    }).catch((err)=> {
        console.log(err);
        Logs.logFile("3-card_not_created",err)
    })
}

// createUserAndCards();

// add new card 

const createACardForUser = ()=>{
    Cards.createUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        email:"ufukkurekci@gmail.com",
        externalId:nanoid(),
        cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes=",
        card:{
            cardAlias:"my_credit_card",
            cardHolderName:"John Doe",
            cardNumber:"5528790000000008",
            expireMonth:"12",
            expireYear:"2030"
        }
    }).then((result) =>{
        console.log(result);
        Logs.logFile("2-card_added",result)
    }).catch((err)=> {
        console.log(err);
        Logs.logFile("2-card_not_added",err)
    })
}

const ReadACardForUser = ()=>{
    Cards.getUserCards({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes=",
    }).then((result) =>{
        console.log(result);
        Logs.logFile("3-card_info",result)
    }).catch((err)=> {
        console.log(err);
        Logs.logFile("3-card_not_info",err)
    })
}
// ReadACardForUser();


// kart silme
const deleteACardForUser = ()=>{
    Cards.deleteUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        cardUserKey: "b/ktW7jrCG25DYWVdujQf1FUYes=",
        cardToken: "j6yE0InDVDMUsP4Xh7dzespstak=",
    }).then((result) =>{
        console.log(result);
        Logs.logFile("4-card_deleted",result)
    }).catch((err)=> {
        console.log(err);
        Logs.logFile("4-card_not_deleted",err)
    })
}

// deleteACardForUser();


// installment methodu ( taksit yapar)

const checkInstallments = () =>{ 
    return Installments.checkInstallment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        binNumber:"55287900",
        price:"10000"
    }).then((result) =>{
        console.log(result);
        Logs.logFile("5-card_installment_success",result)
    }).catch((err)=> {
        console.log(err);
        Logs.logFile("5-card_installment_fail",err)
    })
}

// checkInstallments();

// payment method

const createPayment = () => {
    return Payments.createPayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        price:"350",  // ödeme kırılımı totali 
        paidPrice:"350", // asıl ödenecek olan tutar
        currency: Iyzipay.CURRENCY.TRY,
        installment: "1",
        basket: nanoid(),
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardHolderName:"John Doe",
            cardNumber:"5528790000000008",
            expireMonth:"12",
            expireYear:"2030",
            cvc:"123",
            registerCard: "0"
        },
        buyer: {
            id:"346900",
            name: "John",
            surname: "Doe",
            gsmNumber: "+905554445454",
            email: "email@email.com",
            identityNumber: "343556655678",
            lastLoginDate: "2020-10-05 12:12:12",
            registrationDate: "2020-10-05 12:12:12",
            registrationAddress:"ornek adres ornek adres ornek adres",
            ip:"85.24.78.112",
            city:"Ankara",
            country:"Turkey",
            zipCode:"34732",
        },
        shippingAddress:{
            contactName:"John Doe",
            city:"Ankara",
            country:"Turkey",
            address:"ornek adres ornek adres ornek adres",
            zipCode:"34732",
        },
        billingAddress:{
            contactName:"John Doe",
            city:"Ankara",
            country:"Turkey",
            address:"ornek adres ornek adres ornek adres",
            zipCode:"34732",
        },
        basketItems:[
            {
                id:"ATS2",
                name:"Iphone",
                category1:"Phones",
                category1:"Phones",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 160
            },
            {
                id:"ATS3",
                name:"Samsung",
                category1:"Phones",
                category1:"Phones",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 90
            },
            {
                id:"ATS4",
                name:"Nokia",
                category1:"Phones",
                category1:"Phones",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 100
                },
    ]


    }).then((result) =>{
        console.log(result);
        Logs.logFile("6-payment_success",result)
    }).catch((err)=> {
        console.log(err);
        Logs.logFile("6-payment_fail",err)
    })
}

createPayment();