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
exports.addWrapperHOC = exports.isAddWrapperHOC = void 0;
var react_1 = __importDefault(require("react"));
var markerPropertyName = '__ad-hok-addWrapperHOC';
exports.isAddWrapperHOC = function (func) {
    return markerPropertyName in func;
};
exports.addWrapperHOC = function (hoc, _a) {
    var _b = (_a === void 0 ? {} : _a).displayName, displayName = _b === void 0 ? 'addWrapperHOC()' : _b;
    var ret = function (Component) {
        var WrappedComponent = hoc(Component);
        WrappedComponent.displayName = displayName;
        return function (props) { return react_1.default.createElement(WrappedComponent, __assign({}, props)); };
    };
    ret[markerPropertyName] = true;
    return ret;
};
var addWrapperHOCPublishedType = exports.addWrapperHOC;
exports.default = addWrapperHOCPublishedType;
