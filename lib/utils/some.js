"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var some = function (predicate, array) {
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var value = array_1[_i];
        if (predicate(value)) {
            return true;
        }
    }
    return false;
};
exports.default = some;
