export type ValueOrFunctionOfProps<TValue, TProps> =
  | TValue
  | ((props: TProps) => TValue)

export type CurriedPropsAdder<TProps, AdditionalProps> = (
  props: TProps,
) => TProps & AdditionalProps

export type SimplePropsAdder<AdditionalProps> = <TProps>(
  props: TProps,
) => TProps & AdditionalProps

export type CurriedUnchangedProps<TProps> = (props: TProps) => TProps

export type SimpleUnchangedProps = <TProps>(props: TProps) => TProps

export type DependenciesArgument<TProps, TDependencies extends string> =
  | RequirePath<TDependencies, TProps>[]
  | ((prevProps: TProps, props: TProps) => boolean)

export type RequirePath<
  TPath extends string,
  TObj,
  TError = 'NOT A VALID PATH'
> = TPath extends any
  ? TObj extends (infer TItem)[]
    ? TPath extends `${infer Head}.${infer Rest}`
      ? Head extends `${number}`
        ? `${Head}.${RequirePath<Rest, TItem, TError> & string}`
        : TError
      : TPath extends `${number}`
      ? TPath
      : TError
    : TPath extends `${infer Head}.${infer Rest}`
    ? Head extends keyof TObj
      ? `${Head}.${RequirePath<Rest, TObj[Head], TError> & string}`
      : TError
    : TPath extends keyof TObj
    ? TPath
    : TError
  : never
