import {useReducer, Reducer} from 'react'

import isFunction from 'utils/isFunction'
import mapValues from 'utils/mapValues'
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
) => CurriedPropsAdder<
  TProps,
  TState &
    {
      [K in keyof Updaters]: (
        ...args: Parameters<ReturnType<Updaters[K]>>
      ) => void
    }
>

const addStateHandlers: AddStateHandlersType = (initial, handlers) => (
  props,
) => {
  const computedInitial = useMemoized(
    () => (isFunction(initial) ? initial(props) : initial),
    [],
  )
  type TState = typeof computedInitial
  type TAction = {
    type: keyof typeof handlers
    args: unknown[]
  }
  const reducer: Reducer<TState, TAction> = (state, {type, args}) => ({
    ...state,
    ...handlers[type](state, props)(...args),
  })
  const [state, dispatch] = useReducer(reducer, computedInitial)
  const exposedHandlers = useMemoized(
    () =>
      mapValues(
        (handler, handlerName) => (...args: any[]) => {
          dispatch({
            type: handlerName,
            args,
          })
        },
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
