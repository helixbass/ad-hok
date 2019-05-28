import {isAddPropTypes} from './addPropTypes'
import {isRenderNothing} from './renderNothing'
import {isReturns} from './returns'
import {isAddWrapper} from './addWrapper'
import {isAddWrapperHOC} from './addWrapperHOC'

getArgumentsPropertyName = '__ad-hok-flowMax-getArguments'

isFlowMax = (func) ->
  func[getArgumentsPropertyName]

flowMax = (...funcs) ->
  getPrecedingFuncs = (index) ->
    if index is 0
      []
    else
      funcs[0...index]
  getFollowingFuncs = (index) ->
    funcs[(index + 1)..]
  flowLength = funcs?.length ? 0
  if flowLength
    for func, funcIndex in funcs
      if (getNestedFlowMaxArguments = isFlowMax func)
        return flowMax(
          ...getPrecedingFuncs(funcIndex)
          ...getNestedFlowMaxArguments()
          ...getFollowingFuncs(funcIndex)
        )
      if isAddPropTypes(func) or isAddWrapper(func) or isAddWrapperHOC func
        newFlowMax = flowMax(
          ...getPrecedingFuncs(funcIndex)
          func flowMax ...getFollowingFuncs(funcIndex)
        )
        # Expose original arguments if we're nested
        newFlowMax[getArgumentsPropertyName] = -> funcs
        return newFlowMax
  ret = (...args) ->
    return args[0] unless funcs?.length
    index = 0
    props = null
    while index < flowLength
      func ###:### = funcs[index]
      currentArgs =
        if index is 0
          args
        else
          [props]
      props = func ...currentArgs
      return null if isRenderNothing props
      return returnsVal[1] if (returnsVal = isReturns props)
      index++
    props
  ret[getArgumentsPropertyName] = -> funcs
  ret

export default flowMax
