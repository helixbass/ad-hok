const {toString} = Object.prototype

export const mapValues = <TObject extends {}>(callback: () => , obj: TObject) => {
  const ret = {}
  for key, val of obj
    ret[key] = callback val, key
  ret
}
