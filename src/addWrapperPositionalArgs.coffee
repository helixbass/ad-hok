import React from 'react'

markerPropertyName = '__ad-hok-addWrapperPositionalArgs'

# eslint-disable-next-line known-imports/no-unused-vars
export isAddWrapperPositionalArgs = (func) ->
  func[markerPropertyName]

export default (callback) ->
  ret = (Component) -> (props) ->
    callback(
      (additionalProps) ->
        <Component {...props} {...additionalProps} />
    ,
      props
    )
  ret[markerPropertyName] = yes
  ret
