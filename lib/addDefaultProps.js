"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var isFunction_1 = __importDefault(require("./utils/isFunction"));
var addProps_1 = __importDefault(require("./addProps"));
var addDefaultProps = function (createDefaults) {
    return (0, addProps_1.default)(function (props) {
        var defaults = (0, isFunction_1.default)(createDefaults)
            ? createDefaults(props)
            : createDefaults;
        var newProps = {};
        for (var key in defaults) {
            if (props[key] == null) {
                newProps[key] = defaults[key];
            }
        }
        return newProps;
    });
};
exports.default = addDefaultProps;
