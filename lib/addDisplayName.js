"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAddDisplayName = void 0;
var markerPropertyName = '__ad-hok-addDisplayName';
var isAddDisplayName = function (func) {
    return markerPropertyName in func && func[markerPropertyName];
};
exports.isAddDisplayName = isAddDisplayName;
var addDisplayName = function (displayName) {
    var ret = function (props) { return props; };
    ret[markerPropertyName] = [displayName];
    return ret;
};
exports.default = addDisplayName;
