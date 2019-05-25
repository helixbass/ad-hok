import {isAddPropTypes} from './addPropTypes'
import {isRenderNothing} from './renderNothing'
import {isReturns} from './returns'
import {isAddWrapper} from './addWrapper'

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
  ret = (...args) ->
    return args[0] unless funcs?.length
    flowLength = funcs.length
    index = 0
    props = null
    while index < flowLength
      func ###:### = funcs[index]
      if (getNestedFlowMaxArguments = isFlowMax func)
        funcs ### : ### = [
          ...getPrecedingFuncs(index)
          ...getNestedFlowMaxArguments()
          ...getFollowingFuncs(index)
        ]
        continue
      currentArgs =
        if index is 0
          args
        else
          [props]
      if isAddPropTypes(func) or isAddWrapper func
        return func(flowMax ...getFollowingFuncs(index)) ...currentArgs
      props = func ...currentArgs
      return null if isRenderNothing props
      return returnsVal[1] if (returnsVal = isReturns props)
      index++
    props
  ret[getArgumentsPropertyName] = -> funcs
  ret

export default flowMax
