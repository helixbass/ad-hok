"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWrapper = exports.isAddWrapper = void 0;
var react_1 = __importDefault(require("react"));
var markerPropertyName = '__ad-hok-addWrapper';
exports.isAddWrapper = function (func) {
    return markerPropertyName in func;
};
exports.addWrapper = function (callback) {
    var ret = function (Component) { return function (props) {
        return callback(function (additionalProps) { return (react_1.default.createElement(Component, __assign({}, props, (additionalProps !== null && additionalProps !== void 0 ? additionalProps : {})))); }, props);
    }; };
    ret[markerPropertyName] = true;
    return ret;
};
var addWrapperPublishedType = exports.addWrapper;
exports.default = addWrapperPublishedType;
