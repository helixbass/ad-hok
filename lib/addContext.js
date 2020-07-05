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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var addContext = function (context, name) { return function (props) {
    var _a;
    var value = react_1.useContext(context);
    return __assign(__assign({}, props), (_a = {}, _a[name] = value, _a));
}; };
exports.default = addContext;
