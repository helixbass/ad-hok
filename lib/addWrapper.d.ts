import React, { ReactElement, ComponentType } from 'react';
import { CurriedPropsAdder } from './helperTypes';
export declare const isAddWrapper: (func: Function) => boolean;
export type AddWrapperRenderCallback<TAdditionalProps extends {}> = (additionalProps?: TAdditionalProps) => ReactElement | null;
type AddWrapperCallback<TAdditionalProps extends {}, TProps extends {}> = (render: AddWrapperRenderCallback<TAdditionalProps>, props: TProps) => ReactElement | null;
type AddWrapperPublishedType = <TAdditionalProps extends {}, TProps extends {}>(callback: AddWrapperCallback<TAdditionalProps, TProps>) => CurriedPropsAdder<TProps, TAdditionalProps>;
export declare const addWrapper: <TProps extends {}, TAdditionalProps extends {}>(callback: AddWrapperCallback<TAdditionalProps, TProps>) => (Component: React.ComponentType<TProps & TAdditionalProps>) => (props: TProps) => ReactElement | null;
declare const addWrapperPublishedType: AddWrapperPublishedType;
export default addWrapperPublishedType;
