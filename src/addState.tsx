import {useState} from 'react'

import isFunction from './utils/isFunction'
import useMemoized from './utils/useMemoized'
import {ValueOrFunctionOfProps, CurriedPropsAdder} from './helperTypes'

type AddStateType = <
  TState,
  TStateName extends string,
  TStateUpdaterName extends string,
  TProps extends {}
>(
  stateName: TStateName,
  stateUpdaterName: TStateUpdaterName,
  initialState: ValueOrFunctionOfProps<TState, TProps>,
) => CurriedPropsAdder<
  TProps,
  {[stateName in TStateName]: TState} &
    {
      [stateUpdaterName in TStateUpdaterName]: (
        state: TState | ((prevState: TState) => TState),
      ) => void
    }
>

const addState: AddStateType = (name, setterName, initial) => (props) => {
  const computedInitial = useMemoized(
    () => (isFunction(initial) ? initial(props) : initial),
    [],
  )
  const [state, setter] = useState(computedInitial)
  type TState = typeof state
  type TStateName = typeof name
  type TStateUpdaterName = typeof setterName
  type TProps = typeof props
  return {
    ...props,
    [name]: state,
    [setterName]: setter,
  } as TProps &
    {
      [stateName in TStateName]: TState
    } &
    {
      [stateUpdaterName in TStateUpdaterName]: typeof setter
    }
}

export default addState
