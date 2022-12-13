import mapValues from './utils/mapValues'
import useComputedFromDependencies from './utils/useComputedFromDependencies'

import {CurriedPropsAdder, DependenciesArgument} from './helperTypes'

export interface HandlerCreators<TProps extends {}> {
  [key: string]: (props: TProps) => (...args: any[]) => any
}

type AddHandlersType = <
  TCreators extends HandlerCreators<TProps>,
  TProps extends {}
>(
  handlerCreators: TCreators,
  dependencies?: DependenciesArgument<TProps>,
) => CurriedPropsAdder<
  TProps,
  {
    [handlerName in keyof TCreators]: ReturnType<TCreators[handlerName]>
  }
>

const addHandlers: AddHandlersType = (handlers, dependencies) => (props) => {
  type TProps = typeof props
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
