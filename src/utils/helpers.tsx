const {toString} = Object.prototype

export const mapValues = <TObject extends {}>(callback: () => , obj: TObject) => {
  const ret = {}
  for key, val of obj
    ret[key] = callback val, key
  ret
}

export identity = (x) -> x

# eslint-disable-next-line known-imports/no-unused-vars
export some = (predicate = identity) ->
  (array) ->
    for value in array
      return true if predicate value
    false
