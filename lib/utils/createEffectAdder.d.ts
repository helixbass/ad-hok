import { useEffect, useLayoutEffect } from 'react';
import { CurriedUnchangedProps, DependenciesArgument } from '../helperTypes';
type CreateEffectAdderType = (effectHook: typeof useEffect | typeof useLayoutEffect) => <TProps extends {}>(callback: (props: TProps) => () => void | (() => void | undefined), dependencies?: DependenciesArgument<TProps>) => CurriedUnchangedProps<TProps>;
export type AddEffectType = ReturnType<CreateEffectAdderType>;
declare const createEffectAdder: CreateEffectAdderType;
export default createEffectAdder;
