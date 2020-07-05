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
var isFunction_1 = __importDefault(require("./utils/isFunction"));
var useComputedFromDependencies_1 = __importDefault(require("./utils/useComputedFromDependencies"));
var addProps = function (updater, dependencies) { return function (props) {
    var getAddedProps = function () { return (isFunction_1.default(updater) ? updater(props) : updater); };
    var addedProps = useComputedFromDependencies_1.default({
        compute: getAddedProps,
        dependencies: dependencies,
        props: props,
    });
    return __assign(__assign({}, props), addedProps);
}; };
exports.default = addProps;
