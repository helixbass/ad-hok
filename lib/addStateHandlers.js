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
var mapValues_1 = __importDefault(require("./utils/mapValues"));
var useMemoized_1 = __importDefault(require("./utils/useMemoized"));
var addStateHandlers = function (initial, handlers) { return function (props) {
    var computedInitial = (0, useMemoized_1.default)(function () { return ((0, isFunction_1.default)(initial) ? initial(props) : initial); }, []);
    var reducer = function (state, _a) {
        var type = _a.type, args = _a.args;
        return (__assign(__assign({}, state), handlers[type](state, props).apply(void 0, args)));
    };
    var _a = (0, react_1.useReducer)(reducer, computedInitial), state = _a[0], dispatch = _a[1];
    var exposedHandlers = (0, useMemoized_1.default)(function () {
        return (0, mapValues_1.default)(function (handler, handlerName) { return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            dispatch({
                type: handlerName,
                args: args,
            });
        }; }, handlers);
    }, []);
    return __assign(__assign(__assign({}, props), state), exposedHandlers);
}; };
var addStateHandlersPublishedType = addStateHandlers;
exports.default = addStateHandlersPublishedType;
