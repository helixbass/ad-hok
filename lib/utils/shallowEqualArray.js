"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shallowEqualArray = function (a, b) {
    if (!(a && b))
        return false;
    if (a.length !== b.length)
        return false;
    for (var index = 0; index < a.length; index++) {
        var aElement = a[index];
        var bElement = b[index];
        if (aElement !== bElement)
            return false;
    }
    return true;
};
exports.default = shallowEqualArray;
