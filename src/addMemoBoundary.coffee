import React from 'react'

import addWrapperHOC from './addWrapperHOC'
import {isFunction, some} from './util/helpers'

memo = (compare) -> (component) ->
  React.memo component, compare

defaultCompareDependencies = (dependencies) -> (oldProps, newProps) ->
  not some((dependency) ->
    oldProps[dependency] isnt newProps[dependency]
  ) dependencies

addMemoBoundary = (compare) ->
  compareFunc = if isFunction(compare) or compare is undefined
    compare
  else
    defaultCompareDependencies compare

  addWrapperHOC memo compareFunc

export default addMemoBoundary
