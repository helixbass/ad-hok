import { ValueOrFunctionOfProps, CurriedPropsAdder } from './helperTypes';
type AddDefaultPropsType = <TProps extends {}, TAdditionalProps extends {}>(createProps: ValueOrFunctionOfProps<TAdditionalProps, TProps>) => CurriedPropsAdder<TProps, TAdditionalProps>;
declare const addDefaultProps: AddDefaultPropsType;
export default addDefaultProps;
