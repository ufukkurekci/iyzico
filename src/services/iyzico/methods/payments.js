import iyzipay from "../connection/iyzipay";

export const createPayment = (data) => {
    return new Promise((resolve,reject)=>{
        iyzipay.payment.create(data,(err,result)=>{
            if(err){
                console.log(data);
                reject(err);
            }else{
                console.log(data);
                resolve(result);
            }
        })
    })
}