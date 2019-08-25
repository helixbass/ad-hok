import {isFunction} from 'lodash'

import {isAddPropTypes} from './addPropTypes'
import {isRenderNothing} from './renderNothing'
import {isReturns} from './returns'
import {isAddWrapper} from './addWrapper'
import {isAddWrapperHOC} from './addWrapperHOC'
import {isBranch} from './branch-avoid-circular-dependency'
import {isAddDisplayName} from './addDisplayName'

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
  displayName = null
  wrapExistingDisplayName = (wrapperStr) ->
    "#{wrapperStr}(#{displayName ? ''})"
  if flowLength
    for func, funcIndex in funcs
      if getNestedFlowMaxArguments = isFlowMax func
        return flowMax(
          ...getPrecedingFuncs(funcIndex)
          ...getNestedFlowMaxArguments()
          ...getFollowingFuncs(funcIndex)
        )
      if (
        isAddPropTypes(func) or
        isAddWrapper(func) or
        isAddWrapperHOC(func) or
        isBranch func
      )
        newFollowingFlowMax = flowMax ...getFollowingFuncs(funcIndex)
        if (
          not newFollowingFlowMax.displayName? or
          newFollowingFlowMax.displayName is 'ret'
        )
          newFollowingFlowMax.displayName = switch
            when isAddPropTypes func
              wrapExistingDisplayName 'addPropTypes'
            when isAddWrapper func then wrapExistingDisplayName 'addWrapper'
            when isAddWrapperHOC func
              wrapExistingDisplayName 'addWrapperHOC'
        newFlowMax = flowMax(
          ...getPrecedingFuncs(funcIndex)
          func newFollowingFlowMax
        )
        # Expose original arguments if we're nested
        newFlowMax[getArgumentsPropertyName] = -> funcs
        return newFlowMax
      if addedDisplayName = isAddDisplayName func
        displayName = addedDisplayName[0]
      throw new TypeError 'Expected a function' unless isFunction func
  ret = (...args) ->
    return args[0] unless funcs?.length
    index = 0
    props = null
    while index < flowLength
      func ###:### = funcs[index]
      currentArgs = if index is 0
        args
      else
        [props]
      props = func ...currentArgs
      return null if isRenderNothing props
      return returnsVal[0] if returnsVal = isReturns props
      index++
    props
  ret.displayName = displayName if displayName?
  ret[getArgumentsPropertyName] = -> funcs
  ret

export default flowMax
