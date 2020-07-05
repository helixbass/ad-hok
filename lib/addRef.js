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
var isFunction_1 = __importDefault(require("utils/isFunction"));
var useMemoized_1 = __importDefault(require("utils/useMemoized"));
var addRef = function (name, initialValue) {
    if (initialValue === void 0) { initialValue = undefined; }
    return function (props) {
        var _a;
        var computedInitialValue = useMemoized_1.default(function () { return (isFunction_1.default(initialValue) ? initialValue(props) : initialValue); }, []);
        var ref = react_1.useRef(computedInitialValue);
        return __assign(__assign({}, props), (_a = {}, _a[name] = ref, _a));
    };
};
exports.default = addRef;
