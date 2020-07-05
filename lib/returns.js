"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReturns = void 0;
var key = '__ad-hok-returns';
exports.isReturns = function (props) {
    try {
        if (!(key in props))
            return false;
        return [props[key]];
    }
    catch (_a) {
        return false;
    }
};
var returns = function (callback) { return function (props) {
    var _a;
    return (_a = {},
        _a[key] = callback(props),
        _a);
}; };
exports.default = returns;
