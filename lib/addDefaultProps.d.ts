import { ValueOrFunctionOfProps, CurriedPropsAdder } from './helperTypes';
declare type AddDefaultPropsType = <TProps extends {}, TAdditionalProps extends Partial<TProps>>(createProps: ValueOrFunctionOfProps<TAdditionalProps, TProps>, dependencies?: string[]) => CurriedPropsAdder<TProps, TAdditionalProps>;
declare const addDefaultProps: AddDefaultPropsType;
export default addDefaultProps;
