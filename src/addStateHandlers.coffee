import {useReducer} from 'react'

import {isFunction, mapValues} from './util/helpers'
import useMemoized from './util/useMemoized'

addStateHandlers = (initial, handlers) -> (props) ->
  computedInitial = useMemoized(
    ->
      if isFunction initial
        initial props
      else
        initial
  ,
    []
  )
  reducer = (state, {type, args}) ->
    {
      ...state
      ...handlers[type](state, props)(...args)
    }
  [state, dispatch] = useReducer reducer, computedInitial
  exposedHandlers = useMemoized(
    ->
      mapValues((handler, handlerName) ->
        (...args) ->
          dispatch {
            type: handlerName
            args
          }
      ) handlers
  ,
    []
  )
  {
    ...props
    ...state
    ...exposedHandlers
  }

export default addStateHandlers
