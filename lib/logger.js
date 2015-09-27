"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _this = this;

var log = function log(mes, extra) {
	var line;
	return _regeneratorRuntime.async(function log$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				line = (mes + ".").magenta;

				if (extra) {
					line += " (" + extra.yellow + ")";
				}
				console.log(line);

			case 3:
			case "end":
				return context$1$0.stop();
		}
	}, null, _this);
};

exports.log = log;
var warn = function warn(mes) {
	return _regeneratorRuntime.async(function warn$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				console.log((mes + ".").yellow);

			case 1:
			case "end":
				return context$1$0.stop();
		}
	}, null, _this);
};
exports.warn = warn;