"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemoBoundary = void 0;
var react_1 = __importDefault(require("react"));
var addWrapperHOC_1 = require("./addWrapperHOC");
var get_1 = __importDefault(require("./utils/get"));
var isFunction_1 = __importDefault(require("./utils/isFunction"));
var some_1 = __importDefault(require("./utils/some"));
var memo = function (compare) { return function (Component) { return react_1.default.memo(Component, compare); }; };
var compareDependenciesArray = function (dependencies) { return function (prevProps, props) {
    return !(0, some_1.default)(function (dependency) { return (0, get_1.default)(dependency, prevProps) !== (0, get_1.default)(dependency, props); }, dependencies);
}; };
var addMemoBoundary = function (dependencies) {
    var compareFunc = (0, isFunction_1.default)(dependencies) || dependencies == null
        ? dependencies
        : compareDependenciesArray(dependencies);
    return (0, addWrapperHOC_1.addWrapperHOC)(memo(compareFunc));
};
exports.addMemoBoundary = addMemoBoundary;
var addMemoBoundaryPublishedType = exports.addMemoBoundary;
exports.default = addMemoBoundaryPublishedType;
