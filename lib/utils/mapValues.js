"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mapValues = function (callback, obj) {
    var ret = {};
    for (var key in obj) {
        var value = obj[key];
        ret[key] = callback(value, key);
    }
    return ret;
};
exports.default = mapValues;
