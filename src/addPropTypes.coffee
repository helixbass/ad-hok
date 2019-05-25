import React from 'react'

markerPropertyName = '__ad-hok-addPropTypes'

# eslint-disable-next-line known-imports/no-unused-vars
export isAddPropTypes = (func) ->
  func[markerPropertyName]

export default (propTypes) ->
  ret = (Component) ->
    Component.propTypes = propTypes
    (props) ->
      <Component {...props} />
  ret[markerPropertyName] = yes
  ret
