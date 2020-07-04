import {useReducer, Reducer} from 'react'

import {isFunction, mapValues} from 'utils/helpers'
import useMemoized from 'utils/useMemoized'
import {ValueOrFunctionOfProps, CurriedPropsAdder} from 'helperTypes'

interface StateUpdaters<TProps, TState> {
  [key: string]: (
    state: TState,
    props: TProps,
  ) => (...args: any[]) => Partial<TState>
}

type AddStateHandlersType = <
  Updaters extends StateUpdaters<TProps, TState>,
  TProps,
  TState
>(
  initialState: ValueOrFunctionOfProps<TState, TProps>,
  stateUpdaters: Updaters,
  dependencies?: string[],
) => CurriedPropsAdder<
  TProps,
  TState & {[K in keyof Updaters]: ReturnType<Updaters[K]>}
>

const addStateHandlers: AddStateHandlersType = (initial, handlers) => (
  props,
) => {
  const computedInitial = useMemoized(
    () => (isFunction(initial) ? initial(props) : initial),
    [],
  )
  const reducer: Reducer = (state, {type, args}) => ({
    ...state,
    ...handlers[type](state, props)(...args),
  })
  const [state, dispatch] = useReducer(reducer, computedInitial)
  const exposedHandlers = useMemoized(
    () =>
      mapValues(
        (handler, handlerName) => (...args) =>
          dispatch({
            type: handlerName,
            args,
          }),
        handlers,
      ),
    [],
  )
  return {
    ...props,
    ...state,
    ...exposedHandlers,
  }
}

export default addStateHandlers
