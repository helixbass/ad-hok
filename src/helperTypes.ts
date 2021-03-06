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

export type DependenciesArgument<TProps> =
  | string[]
  | ((prevProps: TProps, props: TProps) => boolean)
