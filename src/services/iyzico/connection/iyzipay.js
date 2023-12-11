import IyziPay from "iyzipay"
import config from "../config/config.json";

const iyzipay = new IyziPay(config);
export default iyzipay;