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
exports.branch = void 0;
var react_1 = __importDefault(require("react"));
var flowMax_1 = __importDefault(require("./flowMax"));
var branch_avoid_circular_dependency_1 = require("./branch-avoid-circular-dependency");
var branch = function (test, consequent, alternate) {
    if (alternate === void 0) { alternate = function (props) {
        return props;
    }; }
    var ret = function (Component) {
        var ConsequentAsComponent = null;
        var createConsequent = function () {
            var _a;
            var Consequent = (0, flowMax_1.default)(consequent, Component);
            Consequent.displayName = "branch(".concat(Consequent.displayName == null || Consequent.displayName === 'ret'
                ? (_a = Component.displayName) !== null && _a !== void 0 ? _a : ''
                : Consequent.displayName, ")");
            return Consequent;
        };
        var AlternateAsComponent = null;
        var createAlternate = function () {
            var _a;
            var Alternate = (0, flowMax_1.default)(alternate, Component);
            Alternate.displayName = "branch(".concat(Alternate.displayName == null || Alternate.displayName === 'ret'
                ? (_a = Component.displayName) !== null && _a !== void 0 ? _a : ''
                : Alternate.displayName, ")");
            return Alternate;
        };
        return function (props) {
            if (test(props)) {
                if (!ConsequentAsComponent) {
                    ConsequentAsComponent = createConsequent();
                }
                var Consequent = ConsequentAsComponent;
                return react_1.default.createElement(Consequent, __assign({}, props));
            }
            else {
                if (!AlternateAsComponent) {
                    AlternateAsComponent = createAlternate();
                }
                var Alternate = AlternateAsComponent;
                return react_1.default.createElement(Alternate, __assign({}, props));
            }
        };
    };
    ret[branch_avoid_circular_dependency_1.markerPropertyName] = true;
    return ret;
};
exports.branch = branch;
var branchPublishedType = exports.branch;
exports.default = branchPublishedType;
