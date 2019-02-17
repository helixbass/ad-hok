import {useState} from 'react'
import {mapValues as fmapValues} from 'lodash/fp'
import {isFunction} from 'lodash'

addStateHandlers = (initial, handlers) -> (props) ->
  state = {}
  setters = {}
  initial ###:### = initial props if isFunction initial
  for key, val of initial
    [stateVal, setter] = useState val
    state[key] = stateVal
    setters[key] = setter
  {
    ...props
    ...state
    ...fmapValues((handler) ->
      (...args) ->
        updatedState = handler(state, props) ...args
        for stateKey, updatedValue of updatedState
          setters[stateKey] updatedValue
    )(handlers)
  }

export default addStateHandlers
