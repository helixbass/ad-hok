export declare type ValueOrFunctionOfProps<TValue, TProps> = TValue | ((props: TProps) => TValue);
export declare type CurriedPropsAdder<TProps, AdditionalProps> = (props: TProps) => TProps & AdditionalProps;
export declare type SimplePropsAdder<AdditionalProps> = <TProps>(props: TProps) => TProps & AdditionalProps;
export declare type UnchangedProps<TProps> = (props: TProps) => TProps;
export declare type SimpleUnchangedProps = <TProps>(props: TProps) => TProps;
export declare type DependenciesArgument<TProps> = string[] | ((prevProps: TProps, props: TProps) => boolean);
