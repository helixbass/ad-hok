import React, { ReactElement, ComponentType } from 'react';
import { CurriedPropsAdder } from './helperTypes';
export declare const isAddWrapper: (func: Function) => boolean;
export declare type AddWrapperRenderCallback<TAdditionalProps> = (additionalProps?: TAdditionalProps) => ReactElement | null;
declare type AddWrapperCallback<TAdditionalProps, TProps> = (render: AddWrapperRenderCallback<TAdditionalProps>, props: TProps) => ReactElement | null;
declare type AddWrapperPublishedType = <TAdditionalProps, TProps>(callback: AddWrapperCallback<TAdditionalProps, TProps>) => CurriedPropsAdder<TProps, TAdditionalProps>;
export declare const addWrapper: <TProps, TAdditionalProps>(callback: AddWrapperCallback<TAdditionalProps, TProps>) => (Component: React.ComponentType<TProps & TAdditionalProps>) => (props: TProps) => ReactElement | null;
declare const addWrapperPublishedType: AddWrapperPublishedType;
export default addWrapperPublishedType;
