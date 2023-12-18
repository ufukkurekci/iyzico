import dotenv from "dotenv";
import config from "./config";

const envPath = config?.production
    ? "./env/.prod"
    : "./env/.dev"

dotenv.config({
    path: envPath
})



console.log(process.env.DEPLOYMENT)