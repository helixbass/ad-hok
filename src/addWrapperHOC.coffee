import React from 'react'

markerPropertyName = '__ad-hok-addWrapperHOC'

# eslint-disable-next-line known-imports/no-unused-vars
export isAddWrapperHOC = (func) ->
  func[markerPropertyName]

export default (hoc, {displayName = 'addWrapperHOC()'} = {}) ->
  ret = (Component) ->
    WrappedComponent = hoc Component
    WrappedComponent.displayName = displayName

    (props) -> <WrappedComponent {...props} />
  ret[markerPropertyName] = yes
  ret
