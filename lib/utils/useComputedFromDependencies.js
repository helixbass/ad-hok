"use strict";
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
var react_1 = require("react");
var isFunction_1 = __importDefault(require("./isFunction"));
var get_1 = __importDefault(require("./get"));
var usePrevious_1 = __importDefault(require("./usePrevious"));
var useMemoized_1 = __importDefault(require("./useMemoized"));
var useComputedFromDependencies = function (_a) {
    var compute = _a.compute, dependencies = _a.dependencies, _b = _a.additionalResolvedDependencies, additionalResolvedDependencies = _b === void 0 ? [] : _b, props = _a.props;
    if (dependencies == null)
        return compute();
    if ((0, isFunction_1.default)(dependencies)) {
        var prevProps = (0, usePrevious_1.default)(props);
        var computedValueRef = (0, react_1.useRef)();
        var didChange = prevProps == null || dependencies(prevProps, props);
        var value = didChange ? compute() : computedValueRef.current;
        computedValueRef.current = value;
        return value;
    }
    return (0, useMemoized_1.default)(compute, __spreadArray(__spreadArray([], dependencies.map(function (dependencyName) { return (0, get_1.default)(dependencyName, props); }), true), additionalResolvedDependencies, true));
};
exports.default = useComputedFromDependencies;
