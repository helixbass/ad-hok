"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var usePrevious_1 = __importDefault(require("./usePrevious"));
var shallowEqualArray_1 = __importDefault(require("./shallowEqualArray"));
var useMemoized = function (compute, dependencies) {
    var memoizedValueRef = (0, react_1.useRef)();
    var prevDependencies = (0, usePrevious_1.default)(dependencies);
    if (!(0, shallowEqualArray_1.default)(prevDependencies, dependencies)) {
        memoizedValueRef.current = compute();
    }
    return memoizedValueRef.current;
};
exports.default = useMemoized;
