import {useReducer, Reducer} from 'react'

import isFunction from './utils/isFunction'
import mapValues from './utils/mapValues'
import useMemoized from './utils/useMemoized'
import {ValueOrFunctionOfProps, CurriedPropsAdder} from './helperTypes'

interface StateUpdaters<TProps extends {}, TState extends {}> {
  [key: string]: (
    state: TState,
    props: TProps,
  ) => (...args: any[]) => Partial<TState>
}

type AddStateHandlersType = <
  Updaters extends StateUpdaters<TProps, TState>,
  TProps extends {},
  TState extends {}
>(
  initialState: ValueOrFunctionOfProps<TState, TProps>,
  stateUpdaters: Updaters,
) => CurriedPropsAdder<
  TProps,
  TState &
    {
      [handlerName in keyof Updaters]: (
        ...args: Parameters<ReturnType<Updaters[handlerName]>>
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

type AddStateHandlersPublishedType = <
  Updaters extends StateUpdaters<TProps, TState>,
  TProps extends {},
  TState extends {}
>(
  initialState: ValueOrFunctionOfProps<TState, TProps>,
  stateUpdaters: Updaters,
) => CurriedPropsAdder<
  TProps,
  TState &
    {
      [handlerName in keyof Updaters]: ReturnType<Updaters[handlerName]>
    }
>

const addStateHandlersPublishedType = addStateHandlers as AddStateHandlersPublishedType
export default addStateHandlersPublishedType
