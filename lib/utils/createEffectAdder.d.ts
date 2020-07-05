import { useEffect, useLayoutEffect } from 'react';
import { UnchangedProps, DependenciesArgument } from '../helperTypes';
declare type CreateEffectAdderType = (effectHook: typeof useEffect | typeof useLayoutEffect) => <TProps>(callback: (props: TProps) => () => void | (() => void | undefined), dependencies?: DependenciesArgument<TProps>) => UnchangedProps<TProps>;
export declare type AddEffectType = ReturnType<CreateEffectAdderType>;
declare const createEffectAdder: CreateEffectAdderType;
export default createEffectAdder;
