"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returns = exports.isReturns = void 0;
var key = '__ad-hok-returns';
var isReturns = function (props) {
    try {
        if (!(key in props))
            return false;
        return [props[key]];
    }
    catch (_a) {
        return false;
    }
};
exports.isReturns = isReturns;
var returns = function (callback) { return function (props) {
    var _a;
    return (_a = {},
        _a[key] = callback(props),
        _a);
}; };
exports.returns = returns;
var returnsPublishedType = exports.returns;
exports.default = returnsPublishedType;
