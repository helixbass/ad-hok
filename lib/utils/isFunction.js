"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toString = Object.prototype.toString;
var isFunction = function (value) {
    return toString.call(value) === '[object Function]';
};
exports.default = isFunction;
