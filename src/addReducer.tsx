import {useReducer, Reducer} from 'react'

import isFunction from 'utils/isFunction'
import useMemoized from 'utils/useMemoized'
import {ValueOrFunctionOfProps} from 'helperTypes'

type AddReducerType = <TState, TAction, TProps>(
  reducer: Reducer<TState, TAction>,
  initialState: ValueOrFunctionOfProps<TState, TProps>,
) => (
  props: TProps,
) => TProps &
  TState & {
    dispatch: (action: TAction) => void
  }

const addReducer: AddReducerType = (reducer, initialState) => (props) => {
  const computedInitialState = useMemoized(
    () => (isFunction(initialState) ? initialState(props) : initialState),
    [],
  )
  const [state, dispatch] = useReducer(reducer, computedInitialState)
  return {
    ...props,
    ...state,
    dispatch,
  }
}

export default addReducer
