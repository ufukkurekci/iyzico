"use strict";

var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_fs.default.writeFileSync("test.txt", "ex", {
  encoding: "utf-8"
});