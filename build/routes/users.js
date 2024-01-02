"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _users = _interopRequireDefault(require("../db/users"));
var _ApiError = _interopRequireDefault(require("../error/ApiError"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  router.post("/login", async (req, res) => {
    console.log(req.body);
    const {
      email,
      password
    } = req.body;
    const user = await _users.default.findOne({
      email: email
    });
    const passwordConfirmed = await _bcryptjs.default.compare(password, user.password);
    if (!user.cardUserKey) {
      throw new _ApiError.default("Kullanıcıya kart eklenmemiş.", 401, "unAuthorized");
    }
    if (!user || passwordConfirmed == false) {
      throw new _ApiError.default("Incorrect password or email", 401, "unAuthorized");
    }
    const UserJson = user.toJSON();
    const token = _jsonwebtoken.default.sign(UserJson, process.env.JWT_SECRET);
    res.json({
      token: `Bearer ${token}`,
      user: UserJson
    });
  });
};
exports.default = _default;