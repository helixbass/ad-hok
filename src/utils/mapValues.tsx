const mapValues = <TObject extends {}, TReturnValue>(
  callback: (value: TObject[keyof TObject], key: keyof TObject) => TReturnValue,
  obj: TObject,
): {
  [key in keyof TObject]: TReturnValue
} => {
  const ret: Partial<
    {
      [key in keyof TObject]: TReturnValue
    }
  > = {}
  for (const key in obj) {
    const value = obj[key]
    ret[key] = callback(value, key)
  }
  return ret as {
    [key in keyof TObject]: TReturnValue
  }
}

export default mapValues
