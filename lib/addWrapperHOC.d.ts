import React, { ComponentType, FC } from 'react';
import { CurriedPropsAdder } from './helperTypes';
export declare const isAddWrapperHOC: (func: Function) => boolean;
export type PropAddingHOC<TAddedProps extends {}> = (Component: ComponentType<any>) => ComponentType<any>;
export declare const addWrapperHOC: <TProps extends {}>(hoc: (Component: React.ComponentType<TProps>) => ComponentType<any>, { displayName }?: {
    displayName?: string | undefined;
}) => (Component: React.ComponentType<TProps>) => React.FC<TProps>;
type AddWrapperHOCType = <AddedProps extends {}, TProps extends {}>(hoc: PropAddingHOC<AddedProps>) => CurriedPropsAdder<TProps, AddedProps>;
declare const addWrapperHOCPublishedType: AddWrapperHOCType;
export default addWrapperHOCPublishedType;
