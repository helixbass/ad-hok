import { MutableRefObject } from 'react';
import { ValueOrFunctionOfProps, CurriedPropsAdder } from './helperTypes';
type AddRefType = <TRefName extends string, TRefValue, TProps extends {}>(refName: TRefName, initialValue?: ValueOrFunctionOfProps<TRefValue, TProps>) => CurriedPropsAdder<TProps, {
    [refName in TRefName]: MutableRefObject<TRefValue>;
}>;
declare const addRef: AddRefType;
export default addRef;
