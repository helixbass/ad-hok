import React from 'react'

markerPropertyName = '__ad-hok-addWrapper'

# eslint-disable-next-line known-imports/no-unused-vars
export isAddWrapper = (func) ->
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
