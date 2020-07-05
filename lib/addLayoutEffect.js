"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var createEffectAdder_1 = __importDefault(require("utils/createEffectAdder"));
var addLayoutEffect = createEffectAdder_1.default(react_1.useLayoutEffect);
exports.default = addLayoutEffect;
