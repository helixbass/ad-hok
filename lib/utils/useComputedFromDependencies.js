"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var isFunction_1 = __importDefault(require("utils/isFunction"));
var get_1 = __importDefault(require("utils/get"));
var usePrevious_1 = __importDefault(require("utils/usePrevious"));
var useMemoized_1 = __importDefault(require("utils/useMemoized"));
var useComputedFromDependencies = function (_a) {
    var compute = _a.compute, dependencies = _a.dependencies, _b = _a.additionalResolvedDependencies, additionalResolvedDependencies = _b === void 0 ? [] : _b, props = _a.props;
    if (dependencies == null)
        return compute();
    if (isFunction_1.default(dependencies)) {
        var prevProps = usePrevious_1.default(props);
        var computedValueRef = react_1.useRef();
        var didChange = prevProps == null || dependencies(prevProps, props);
        var value = didChange ? compute() : computedValueRef.current;
        computedValueRef.current = value;
        return value;
    }
    return useMemoized_1.default(compute, __spreadArrays(dependencies.map(function (dependencyName) { return get_1.default(dependencyName, props); }), additionalResolvedDependencies));
};
exports.default = useComputedFromDependencies;
