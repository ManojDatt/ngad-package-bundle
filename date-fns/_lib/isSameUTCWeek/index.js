"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isSameUTCWeek;

var _index = _interopRequireDefault(require("../requiredArgs/index.js"));

var _index2 = _interopRequireDefault(require("../startOfUTCWeek/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isSameUTCWeek(dirtyDateLeft, dirtyDateRight, options) {
  (0, _index.default)(2, arguments);
  var dateLeftStartOfWeek = (0, _index2.default)(dirtyDateLeft, options);
  var dateRightStartOfWeek = (0, _index2.default)(dirtyDateRight, options);
  return dateLeftStartOfWeek.getTime() === dateRightStartOfWeek.getTime();
}

module.exports = exports.default;