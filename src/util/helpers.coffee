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
    ret[key] = callback val
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
