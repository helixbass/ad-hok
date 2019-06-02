export markerPropertyName = '__ad-hok-branch'

# eslint-disable-next-line known-imports/no-unused-vars
export isBranch = (func) ->
  func[markerPropertyName]
