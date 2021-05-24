import mapValues from './utils/mapValues'
import useComputedFromDependencies from './utils/useComputedFromDependencies'

import {CurriedPropsAdder, DependenciesArgument} from './helperTypes'

export interface HandlerCreators<TProps> {
  [key: string]: (props: TProps) => (...args: any[]) => any
}

type AddHandlersType = <
  TCreators extends HandlerCreators<TProps>,
  TProps,
  TDependencies extends string
>(
  handlerCreators: TCreators,
  dependencies?: DependenciesArgument<TProps, TDependencies>,
) => CurriedPropsAdder<
  TProps,
  {
    [handlerName in keyof TCreators]: ReturnType<TCreators[handlerName]>
  }
>

const addHandlers: AddHandlersType = (handlers, dependencies) => (props) => {
  type TCreators = typeof handlers
  const createHandlerProps = () =>
    mapValues((createHandler) => createHandler(props), handlers) as {
      [handlerName in keyof TCreators]: ReturnType<TCreators[handlerName]>
    }

  const handlerProps = useComputedFromDependencies({
    compute: createHandlerProps,
    dependencies,
    props,
  })

  return {
    ...props,
    ...handlerProps,
  }
}

export default addHandlers
