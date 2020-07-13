const get = (
  path: string,
  obj: {
    [key: string]: any
  },
): any => {
  const pathParts = path.split('.')
  let value = obj
  for (const pathPart of pathParts) {
    if (value == null) return undefined
    value = value?.[pathPart]
  }
  return value
}

export default get
