export const markerPropertyName = '__ad-hok-branch'

export const isBranch = (func: Function): boolean => markerPropertyName in func
