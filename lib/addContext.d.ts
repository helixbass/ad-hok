import { Context } from 'react';
import { CurriedPropsAdder } from './helperTypes';
type AddContextType = <TContextName extends string, TContextValue, TProps extends {}>(context: Context<TContextValue>, contextName: TContextName) => CurriedPropsAdder<TProps, {
    [contextName in TContextName]: TContextValue;
}>;
declare const addContext: AddContextType;
export default addContext;
