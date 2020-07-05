import { ValueOrFunctionOfProps, CurriedPropsAdder, DependenciesArgument } from 'helperTypes';
declare type AddPropsType = <TProps extends {}, AdditionalProps extends {
    [key: string]: any;
}>(createProps: ValueOrFunctionOfProps<AdditionalProps, TProps>, dependencies?: DependenciesArgument<TProps>) => CurriedPropsAdder<TProps, AdditionalProps>;
declare const addProps: AddPropsType;
export default addProps;
