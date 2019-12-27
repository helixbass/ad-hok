import {useState, useRef} from 'react'

import {isFunction, isArray, mapValues} from './util/helpers'
import usePrevious from './util/usePrevious'
import useComputedFromDependencies from './util/useComputedFromDependencies'

addStateHandlers = (initial, handlers, dependencies) -> (props) ->
  state = {}
  setters = {}
  computedInitial = useRef()
  useInitial = do ->
    return initial unless isFunction initial
    computedInitial.current ?= initial props
    computedInitial.current
  for key, val of useInitial
    [stateVal, setter] = useState val
    state[key] = stateVal
    setters[key] = setter

  createHandlerProps = ->
    mapValues((handler) ->
      curriedHandler = handler state, props
      (...args) ->
        updatedState = curriedHandler ...args
        for stateKey, updatedValue of updatedState
          setters[stateKey] updatedValue
    ) handlers

  handlerProps = useComputedFromDependencies {
    compute: createHandlerProps
    dependencies: if dependencies?
      if isFunction dependencies
        prevState = usePrevious state
        hasStateChanged = do ->
          return yes unless prevState?
          # eslint-disable-next-line coffee/no-overwrite
          for key of useInitial
            currentStateVal = state[key]
            prevStateVal = prevState[key]
            return yes unless currentStateVal is prevStateVal
          no
        (prevProps, _props) ->
          return yes if hasStateChanged
          dependencies prevProps, _props
      else
        dependencies
    additionalResolvedDependencies: if isArray dependencies
      state[key] for key of useInitial
    props
  }

  {
    ...props
    ...state
    ...handlerProps
  }

export default addStateHandlers
