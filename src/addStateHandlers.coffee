import {useState, useMemo, useRef} from 'react'
import {isFunction, mapValues} from './util/helpers'

addStateHandlers = (initial, handlers, dependencyNames) -> (props) ->
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

  handlerProps = if dependencyNames?
    useMemo createHandlerProps, [
      ...(state[key] for key of useInitial)
      ...(props[dependencyName] for dependencyName in dependencyNames)
    ]
  else
    createHandlerProps()

  {
    ...props
    ...state
    ...handlerProps
  }

export default addStateHandlers
