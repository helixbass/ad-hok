import {isAddPropTypes} from './addPropTypes'
import {isRenderNothing} from './renderNothing'
import {isReturns} from './returns'

flowMax = (...funcs) ->
  flowLength = funcs?.length ? 0
  if flowLength
    for func, funcIndex in funcs when isAddPropTypes(func)
      precedingFuncs =
        if funcIndex is 0
          []
        else
          funcs[0...funcIndex]
      return flowMax ...precedingFuncs, func flowMax ...funcs[(funcIndex + 1)..]
  (...args) ->
    index = 0
    props =
      if flowLength
        funcs[0] ...args
      else
        args[0]
    return null if isRenderNothing props
    return returnsVal[1] if (returnsVal = isReturns props)
    while ++index < flowLength
      func ###:### = funcs[index]
      props = func props
      return null if isRenderNothing props
      return returnsVal[1] if (returnsVal = isReturns props)
    props

export default flowMax
