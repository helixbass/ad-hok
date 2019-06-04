markerPropertyName = '__ad-hok-addDisplayName'

# eslint-disable-next-line known-imports/no-unused-vars
export isAddDisplayName = (func) ->
  func[markerPropertyName]

export default (displayName) ->
  ret = (props) -> props
  ret[markerPropertyName] = [displayName]
  ret
