import React, { ComponentType, FC } from 'react';
import { ValidationMap } from 'prop-types';
import { CurriedUnchangedProps } from './helperTypes';
export declare const isAddPropTypes: (func: Function) => boolean;
type AddPropTypesType = <TPropTypes, TProps extends {}>(propTypes: ValidationMap<TPropTypes>) => CurriedUnchangedProps<TProps>;
export declare const addPropTypes: <TPropTypes extends React.WeakValidationMap<TProps>, TProps extends {}>(propTypes: TPropTypes) => (Component: React.ComponentType<TProps>) => React.FC<TProps>;
declare const addPropTypesPublishedType: AddPropTypesType;
export default addPropTypesPublishedType;
