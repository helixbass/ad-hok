import {useReducer} from 'react'

import {isFunction} from './util/helpers'
import useMemoized from './util/useMemoized'

addReducer = (reducer, initialState) ->
  (props) ->
    computedInitialState = useMemoized(
      ->
        if isFunction initialState
          initialState props
        else
          initialState
    ,
      []
    )
    [state, dispatch] = useReducer reducer, computedInitialState
    {
      ...props
      ...state
      dispatch
    }

export default addReducer
