import React, { ComponentType, FC } from 'react';
import { ValidationMap } from 'prop-types';
import { UnchangedProps } from 'helperTypes';
export declare const isAddPropTypes: (func: Function) => boolean;
declare type AddPropTypesType = <TPropTypes, TProps>(propTypes: ValidationMap<TPropTypes>) => UnchangedProps<TProps>;
export declare const addPropTypes: <TPropTypes, TProps>(propTypes: TPropTypes) => (Component: React.ComponentType<TProps>) => React.FC<TProps>;
declare const addPropTypesPublishedType: AddPropTypesType;
export default addPropTypesPublishedType;
