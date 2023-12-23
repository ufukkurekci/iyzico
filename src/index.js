import "express-async-errors";
import dotenv from "dotenv";
import config from "./config";
import express from "express";
import logger from "morgan";
import https from "https";
import fs from "fs";
import path from "path";
import cors from "cors";
import DBModules from "./db";
import Users from "./db/users";
import helmet from "helmet";
import GenericErrorHandler from "./middlewares/GenericErrorHandler";
import ApiError from "./error/ApiError";
import mongoose from "mongoose";
import passport from "passport";
import Session from "./middlewares/Session";
import { ExtractJwt , Strategy as JwtStrategy } from "passport-jwt";
import test from "node:test";

const envPath = config?.production
    ? "./env/.prod"
    : "./env/.dev"

dotenv.config({
    path: envPath
})

// BEGIN MONGO 
mongoose.connect(process.env.MONGO_URI,
).then(() => {
    console.log("connected mongodb");
}).catch((err) => {
    console.log(err);
})
// END MONGO CONNECT
const app = express();

app.use(logger(process.env.LOGGER))

app.use(helmet());

app.use(cors({
    origin: "*"
}));


app.use(express.json({
    limit: "1mb"
}));

app.use(express.urlencoded({
    extended: true
}));

passport.serializeUser((user,done) =>{
    done(null,user);
});

passport.deserializeUser((id,done) =>{
    done(null,id);
});

app.use(passport.initialize());

const jwtOpt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(
    new JwtStrategy(
        jwtOpt,
        async (jwtPayload, done) => {
            try {
                const user = await Users.findOne({_id: jwtPayload._id});
                if (user) {
                    console.log("*************")
                    console.log(user);
                    console.log("*************")
                    done(null,user.toJSON())
                }
                else {
                    done(new ApiError("Authorization is failed",401,"authorizationInvalid"),false);
                }
            } catch (error) {
                return done(error,false)
            }
        }
    )
)


// app.use("/",(req,res) => {
//     throw new ApiError("An error exception", 404, "fucked_up")
//     res.json({
//         test: 1
//     })
// })


app.all("/test-auth", Session, (req, res) => {
    res.json({
        test: true
    });
});


app.use(GenericErrorHandler);

if(process.env.HTTPS_ENABLED === "true")
{
    const key = fs.readFileSync(path.join(__dirname,"./certs/key.pem")).toString();
    const cert = fs.readFileSync(path.join(__dirname,"./certs/cert.pem")).toString();

    const server = https.createServer({
        key: key,
        cert: cert
    },app);

    server.listen(process.env.PORT, () => console.log("Express app start listen " + process.env.PORT));
}
else{
    app.listen(process.env.PORT, () => console.log("Express app start listen " + process.env.PORT))

}


