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
var mapValues_1 = __importDefault(require("./utils/mapValues"));
var useComputedFromDependencies_1 = __importDefault(require("./utils/useComputedFromDependencies"));
var addHandlers = function (handlers, dependencies) { return function (props) {
    var createHandlerProps = function () {
        return (0, mapValues_1.default)(function (createHandler) { return createHandler(props); }, handlers);
    };
    var handlerProps = (0, useComputedFromDependencies_1.default)({
        compute: createHandlerProps,
        dependencies: dependencies,
        props: props,
    });
    return __assign(__assign({}, props), handlerProps);
}; };
exports.default = addHandlers;
