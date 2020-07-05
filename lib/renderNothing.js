"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRenderNothing = void 0;
var nonce = {};
exports.isRenderNothing = function (value) { return value === nonce; };
var renderNothing = function () { return function (props) { return nonce; }; };
exports.default = renderNothing;
