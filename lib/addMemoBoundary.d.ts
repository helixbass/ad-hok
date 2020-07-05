import React, { ComponentType, FC } from 'react';
import { UnchangedProps, DependenciesArgument } from './helperTypes';
export declare const addMemoBoundary: <TProps>(dependencies?: string[] | ((prevProps: TProps, props: TProps) => boolean) | undefined) => (Component: React.ComponentType<TProps>) => React.FC<TProps>;
declare type AddMemoBoundaryType = <TProps>(dependencies?: DependenciesArgument<TProps>) => UnchangedProps<TProps>;
declare const addMemoBoundaryPublishedType: AddMemoBoundaryType;
export default addMemoBoundaryPublishedType;
