"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var addPropTypes_1 = require("./addPropTypes");
var renderNothing_1 = require("./renderNothing");
var returns_1 = require("./returns");
var addWrapper_1 = require("./addWrapper");
var addWrapperHOC_1 = require("./addWrapperHOC");
var branch_avoid_circular_dependency_1 = require("./branch-avoid-circular-dependency");
var addDisplayName_1 = __importStar(require("./addDisplayName"));
var isFunction_1 = __importDefault(require("./utils/isFunction"));
var getArgumentsPropertyName = '__ad-hok-flowMax-getArguments';
var isFlowMax = function (func) {
    return getArgumentsPropertyName in func && func[getArgumentsPropertyName];
};
var flowMax = function () {
    var funcs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        funcs[_i] = arguments[_i];
    }
    var getPrecedingFuncs = function (index) {
        return index === 0 ? [] : funcs.slice(0, index);
    };
    var displayName = null;
    var getFollowingFuncs = function (index, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.wrappedDisplayName, wrappedDisplayName = _c === void 0 ? displayName : _c;
        var followingFuncs = funcs.slice(index + 1);
        if (wrappedDisplayName == null) {
            return followingFuncs;
        }
        return __spreadArray([(0, addDisplayName_1.default)(wrappedDisplayName)], followingFuncs, true);
    };
    var flowLength = funcs.length;
    var wrapExistingDisplayName = function (wrapperStr) {
        return "".concat(wrapperStr, "(").concat(displayName !== null && displayName !== void 0 ? displayName : '', ")");
    };
    if (flowLength) {
        for (var funcIndex = 0; funcIndex < funcs.length; funcIndex++) {
            var func = funcs[funcIndex];
            if (!(0, isFunction_1.default)(func)) {
                throw new TypeError('Expected a function');
            }
            var getNestedFlowMaxArguments = isFlowMax(func);
            if (getNestedFlowMaxArguments) {
                return flowMax.apply(void 0, __spreadArray(__spreadArray(__spreadArray([], getPrecedingFuncs(funcIndex), false), getNestedFlowMaxArguments(), false), getFollowingFuncs(funcIndex), false));
            }
            if ((0, addPropTypes_1.isAddPropTypes)(func) ||
                (0, addWrapper_1.isAddWrapper)(func) ||
                (0, addWrapperHOC_1.isAddWrapperHOC)(func) ||
                (0, branch_avoid_circular_dependency_1.isBranch)(func)) {
                var wrappedDisplayName = (0, addPropTypes_1.isAddPropTypes)(func)
                    ? wrapExistingDisplayName('addPropTypes')
                    : (0, addWrapper_1.isAddWrapper)(func)
                        ? wrapExistingDisplayName('addWrapper')
                        : (0, addWrapperHOC_1.isAddWrapperHOC)(func)
                            ? wrapExistingDisplayName('addWrapperHOC')
                            : undefined;
                var newFollowingFlowMax = flowMax.apply(void 0, getFollowingFuncs(funcIndex, { wrappedDisplayName: wrappedDisplayName }));
                if (newFollowingFlowMax.displayName == null ||
                    newFollowingFlowMax.displayName === 'ret') {
                    ;
                    newFollowingFlowMax.displayName = wrappedDisplayName;
                }
                var newFlowMax = flowMax.apply(void 0, __spreadArray(__spreadArray([], getPrecedingFuncs(funcIndex), false), [func(newFollowingFlowMax)], false));
                newFlowMax[getArgumentsPropertyName] = function () { return funcs; };
                return newFlowMax;
            }
            var addedDisplayName = (0, addDisplayName_1.isAddDisplayName)(func);
            if (addedDisplayName) {
                displayName = addedDisplayName[0];
            }
        }
    }
    var ret = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!funcs.length)
            return args[0];
        var index = 0;
        var props = null;
        while (index < flowLength) {
            var func = funcs[index];
            var currentArgs = index === 0 ? args : [props];
            props = func.apply(void 0, currentArgs);
            if ((0, renderNothing_1.isRenderNothing)(props)) {
                return null;
            }
            var returnsVal = (0, returns_1.isReturns)(props);
            if (returnsVal) {
                return returnsVal[0];
            }
            index++;
        }
        return props;
    };
    if (displayName != null) {
        ret.displayName = displayName;
    }
    ;
    ret[getArgumentsPropertyName] = function () { return funcs; };
    return ret;
};
var flowMaxPublishedType = flowMax;
exports.default = flowMaxPublishedType;
