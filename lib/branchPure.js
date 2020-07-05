"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var branchPure = function (test, consequent, alternate) {
    if (alternate === void 0) { alternate = function (props) { return props; }; }
    return function (props) { return (test(props) ? consequent(props) : alternate(props)); };
};
var branchPurePublishedType = branchPure;
exports.default = branchPurePublishedType;
