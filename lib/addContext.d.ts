import { Context } from 'react';
import { CurriedPropsAdder } from './helperTypes';
declare type AddContextType = <TContextName extends string, TContext, TProps>(context: Context<TContext>, contextName: TContextName) => CurriedPropsAdder<TProps, {
    [contextName in TContextName]: TContext;
}>;
declare const addContext: AddContextType;
export default addContext;
