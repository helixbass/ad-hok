import React, { ComponentType, FC } from 'react';
import { CurriedPropsAdder } from './helperTypes';
export declare const isAddWrapperHOC: (func: Function) => boolean;
export declare type PropAddingHOC<TAddedProps> = (Component: ComponentType<any>) => ComponentType<any>;
export declare const addWrapperHOC: <TProps>(hoc: (Component: React.ComponentType<TProps>) => ComponentType<any>, { displayName }?: {
    displayName?: string | undefined;
}) => (Component: React.ComponentType<TProps>) => React.FC<TProps>;
declare type AddWrapperHOCType = <AddedProps, TProps>(hoc: PropAddingHOC<AddedProps>) => CurriedPropsAdder<TProps, AddedProps>;
declare const addWrapperHOCPublishedType: AddWrapperHOCType;
export default addWrapperHOCPublishedType;
