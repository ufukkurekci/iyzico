import iyzipay from "../connection/iyzipay";

export const createPayment = (data) => {
    return new Promise((resolve,reject)=>{
        iyzipay.payment.create(data,(err,reject)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}