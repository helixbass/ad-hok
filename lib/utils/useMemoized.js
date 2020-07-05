"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var usePrevious_1 = __importDefault(require("utils/usePrevious"));
var shallowEqualArray_1 = __importDefault(require("utils/shallowEqualArray"));
var useMemoized = function (compute, dependencies) {
    var memoizedValueRef = react_1.useRef();
    var prevDependencies = usePrevious_1.default(dependencies);
    if (!shallowEqualArray_1.default(prevDependencies, dependencies)) {
        memoizedValueRef.current = compute();
    }
    return memoizedValueRef.current;
};
exports.default = useMemoized;
