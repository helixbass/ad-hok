import React, { ComponentType, FC } from 'react';
import { CurriedUnchangedProps, DependenciesArgument } from './helperTypes';
export declare const addMemoBoundary: <TProps extends {}>(dependencies?: DependenciesArgument<TProps> | undefined) => (Component: React.ComponentType<TProps>) => React.FC<TProps>;
type AddMemoBoundaryType = <TProps extends {}>(dependencies?: DependenciesArgument<TProps>) => CurriedUnchangedProps<TProps>;
declare const addMemoBoundaryPublishedType: AddMemoBoundaryType;
export default addMemoBoundaryPublishedType;
