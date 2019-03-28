import {isAddPropTypes} from './addPropTypes'
import {isRenderNothing} from './renderNothing'
import {isReturns} from './returns'

flowMax = (...funcs) ->
  flowLength = funcs?.length ? 0
  (...args) ->
    index = 0
    if flowLength and isAddPropTypes funcs[0]
      return funcs[0](flowMax ...funcs[(index + 1)..]) ...args
    props =
      if flowLength
        funcs[0] ...args
      else
        args[0]
    return null if isRenderNothing props
    return returnsVal[1] if (returnsVal = isReturns props)
    while ++index < flowLength
      func = funcs[index]
      if isAddPropTypes func
        return func(flowMax ...funcs[(index + 1)..]) props
      props = func props
      return null if isRenderNothing props
      return returnsVal[1] if (returnsVal = isReturns props)
    props

export default flowMax
