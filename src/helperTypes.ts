export type ValueOrFunctionOfProps<TValue, TProps extends {}> =
  | TValue
  | ((props: TProps) => TValue)

export type CurriedPropsAdder<TProps extends {}, AdditionalProps extends {}> = (
  props: TProps,
) => TProps & AdditionalProps

export type SimplePropsAdder<AdditionalProps extends {}> = <TProps extends {}>(
  props: TProps,
) => TProps & AdditionalProps

export type CurriedUnchangedProps<TProps extends {}> = (props: TProps) => TProps

export type SimpleUnchangedProps = <TProps extends {}>(props: TProps) => TProps

export type DependenciesArgument<TProps extends {}> =
  | string[]
  | ((prevProps: TProps, props: TProps) => boolean)
