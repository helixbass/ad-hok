import {useState, useMemo} from 'react'
import {isFunction} from 'lodash'
import {mapValues} from 'lodash/fp'

addStateHandlers = (initial, handlers, dependencyNames) -> (props) ->
  state = {}
  setters = {}
  initial ###:### = initial props if isFunction initial
  for key, val of initial
    [stateVal, setter] = useState val
    state[key] = stateVal
    setters[key] = setter

  createHandlerProps = ->
    mapValues((handler) ->
      (...args) ->
        updatedState = handler(state, props) ...args
        for stateKey, updatedValue of updatedState
          setters[stateKey] updatedValue
    ) handlers

  handlerProps = if dependencyNames?
    useMemo createHandlerProps, [
      ...(state[key] for key of initial)
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
