import { ValueOrFunctionOfProps, CurriedPropsAdder, DependenciesArgument } from './helperTypes';
type AddPropsType = <TProps extends {}, TAdditionalProps extends {
    [key: string]: any;
}>(createProps: ValueOrFunctionOfProps<TAdditionalProps, TProps>, dependencies?: DependenciesArgument<TProps>) => CurriedPropsAdder<TProps, TAdditionalProps>;
declare const addProps: AddPropsType;
export default addProps;
