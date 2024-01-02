"use strict";

require("express-async-errors");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _config = _interopRequireDefault(require("./config"));
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _https = _interopRequireDefault(require("https"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _cors = _interopRequireDefault(require("cors"));
var _db = _interopRequireDefault(require("./db"));
var _users = _interopRequireDefault(require("./db/users"));
var _helmet = _interopRequireDefault(require("helmet"));
var _GenericErrorHandler = _interopRequireDefault(require("./middlewares/GenericErrorHandler"));
var _ApiError = _interopRequireDefault(require("./error/ApiError"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _passport = _interopRequireDefault(require("passport"));
var _Session = _interopRequireDefault(require("./middlewares/Session"));
var _passportJwt = require("passport-jwt");
var _nodeTest = _interopRequireDefault(require("node:test"));
var _index = _interopRequireDefault(require("./routes/index"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const envPath = _config.default?.production ? "./env/.prod" : "./env/.dev";
_dotenv.default.config({
  path: envPath
});

// BEGIN MONGO 
_mongoose.default.connect(process.env.MONGO_URI).then(() => {
  console.log("connected mongodb");
}).catch(err => {
  console.log(err);
});
// END MONGO CONNECT

const app = (0, _express.default)();
const router = _express.default.Router();
app.use((0, _morgan.default)(process.env.LOGGER));
app.use((0, _helmet.default)());
app.use((0, _cors.default)({
  origin: "*"
}));
app.use(_express.default.json({
  limit: "1mb"
}));
app.use(_express.default.urlencoded({
  extended: true
}));
_passport.default.serializeUser((user, done) => {
  done(null, user);
});
_passport.default.deserializeUser((id, done) => {
  done(null, id);
});
app.use(_passport.default.initialize());
const jwtOpt = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};
_passport.default.use(new _passportJwt.Strategy(jwtOpt, async (jwtPayload, done) => {
  try {
    const user = await _users.default.findOne({
      _id: jwtPayload._id
    });
    if (user) {
      done(null, user.toJSON());
    } else {
      done(new _ApiError.default("Authorization is failed", 401, "authorizationInvalid"), false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

// app.use("/",(req,res) => {
//     throw new ApiError("An error exception", 404, "fucked_up")
//     res.json({
//         test: 1
//     })
// })

_index.default.forEach((routeFn, index) => {
  routeFn(router);
});
app.use("/api", router);
app.all("/test-auth", _Session.default, (req, res) => {
  res.json({
    test: true
  });
});
app.use(_GenericErrorHandler.default);
if (process.env.HTTPS_ENABLED === "true") {
  const key = _fs.default.readFileSync(_path.default.join(__dirname, "./certs/key.pem")).toString();
  const cert = _fs.default.readFileSync(_path.default.join(__dirname, "./certs/cert.pem")).toString();
  const server = _https.default.createServer({
    key: key,
    cert: cert
  }, app);
  server.listen(process.env.PORT, () => console.log("Express app start listen " + process.env.PORT));
} else {
  app.listen(process.env.PORT, () => console.log("Express app start listen " + process.env.PORT));
}