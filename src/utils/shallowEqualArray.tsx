const shallowEqualArray = <TValue,>(
  a: TValue[] | undefined,
  b: TValue[] | undefined,
): boolean => {
  if (!(a && b)) return false
  if (a.length !== b.length) return false
  for (let index = 0; index < a.length; index++) {
    const aElement = a[index]
    const bElement = b[index]
    if (aElement !== bElement) return false
  }
  return true
}

export default shallowEqualArray
