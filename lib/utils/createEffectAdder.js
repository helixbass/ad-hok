"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var isArray_1 = __importDefault(require("./isArray"));
var get_1 = __importDefault(require("./get"));
var shallowEqualArray_1 = __importDefault(require("./shallowEqualArray"));
var usePrevious_1 = __importDefault(require("./usePrevious"));
var isSimpleDependenciesArray = function (dependencies) {
    if (!isArray_1.default(dependencies))
        return false;
    for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
        var dependency = dependencies_1[_i];
        if (dependency.indexOf('.') > -1) {
            return false;
        }
    }
    return true;
};
var createEffectAdder = function (effectHook) { return function (callback, dependencies) {
    var isDependenciesSimpleArray = isSimpleDependenciesArray(dependencies);
    return function (props) {
        var prevProps = usePrevious_1.default(props);
        if (!dependencies) {
            effectHook(callback(props));
        }
        else if (isArray_1.default(dependencies) && isDependenciesSimpleArray) {
            // TODO: throw nice error if changeProps isn't array/iterable or any changeProp isn't a string?
            effectHook(callback(props), dependencies.map(function (dependencyPropName) { return props[dependencyPropName]; }));
        }
        else {
            if (isArray_1.default(dependencies)) {
                effectHook(function () {
                    if (prevProps != null &&
                        shallowEqualArray_1.default(dependencies.map(function (dependencyName) {
                            return get_1.default(dependencyName, prevProps);
                        }), dependencies.map(function (dependencyName) { return get_1.default(dependencyName, props); })))
                        return;
                    return callback(props)();
                });
            }
            else {
                effectHook(function () {
                    if (prevProps != null && !dependencies(prevProps, props))
                        return;
                    return callback(props)();
                });
            }
        }
        return props;
    };
}; };
exports.default = createEffectAdder;
