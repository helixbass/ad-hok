"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBranch = exports.markerPropertyName = void 0;
exports.markerPropertyName = '__ad-hok-branch';
var isBranch = function (func) { return exports.markerPropertyName in func; };
exports.isBranch = isBranch;
