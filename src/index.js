import dotenv from "dotenv";
import config from "./config";
import express from "express"
import logger from "morgan"


const envPath = config?.production
    ? "./env/.prod"
    : "./env/.dev"

dotenv.config({
    path: envPath
})


const app = express();

app.use(logger(process.env.LOGGER))

app.use(express.json({
    limit: "1mb"
}));

app.use(express.urlencoded({
    extended: true
}));

app.listen(process.env.PORT, () => console.log("Express app start listen " + process.env.PORT))