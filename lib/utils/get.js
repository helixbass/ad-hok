"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var get = function (path, obj) {
    var pathParts = path.split('.');
    var value = obj;
    for (var _i = 0, pathParts_1 = pathParts; _i < pathParts_1.length; _i++) {
        var pathPart = pathParts_1[_i];
        if (value == null)
            return undefined;
        value = value === null || value === void 0 ? void 0 : value[pathPart];
    }
    return value;
};
exports.default = get;
