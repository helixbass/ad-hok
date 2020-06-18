{toString} = Object::

# eslint-disable-next-line known-imports/no-unused-vars
export isArray = Array.isArray ? (obj) ->
  toString.call(obj) is '[object Array]'

# eslint-disable-next-line known-imports/no-unused-vars
export isFunction = (obj) ->
  toString.call(obj) is '[object Function]'

# eslint-disable-next-line known-imports/no-unused-vars
export mapValues = (callback) -> (obj) ->
  ret = {}
  for key, val of obj
    ret[key] = callback val, key
  ret

# eslint-disable-next-line known-imports/no-unused-vars
export get = (path) ->
  pathParts = path.split '.'
  (obj) ->
    val = obj
    for pathPart in pathParts
      return unless val?
      val = val?[pathPart]
    val

# eslint-disable-next-line known-imports/no-unused-vars
export shallowEqualArray = (a, b) ->
  return no unless a?.length? and b?.length?
  return no unless a.length is b.length
  for element, index in a
    return no unless element is b[index]
  yes

export identity = (x) -> x

# eslint-disable-next-line known-imports/no-unused-vars
export some = (predicate = identity) ->
  (array) ->
    for value in array
      return true if predicate value
    false
