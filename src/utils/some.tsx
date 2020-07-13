const some = <TValue,>(
  predicate: (value: TValue) => boolean,
  array: TValue[],
): boolean => {
  for (const value of array) {
    if (predicate(value)) {
      return true
    }
  }
  return false
}

export default some
