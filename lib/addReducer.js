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
var react_1 = require("react");
var isFunction_1 = __importDefault(require("./utils/isFunction"));
var useMemoized_1 = __importDefault(require("./utils/useMemoized"));
var addReducer = function (reducer, initialState) { return function (props) {
    var computedInitialState = (0, useMemoized_1.default)(function () { return ((0, isFunction_1.default)(initialState) ? initialState(props) : initialState); }, []);
    var _a = (0, react_1.useReducer)(reducer, computedInitialState), state = _a[0], dispatch = _a[1];
    return __assign(__assign(__assign({}, props), state), { dispatch: dispatch });
}; };
exports.default = addReducer;
