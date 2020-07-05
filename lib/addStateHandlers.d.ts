import { ValueOrFunctionOfProps, CurriedPropsAdder } from 'helperTypes';
interface StateUpdaters<TProps, TState> {
    [key: string]: (state: TState, props: TProps) => (...args: any[]) => Partial<TState>;
}
declare type AddStateHandlersType = <Updaters extends StateUpdaters<TProps, TState>, TProps, TState>(initialState: ValueOrFunctionOfProps<TState, TProps>, stateUpdaters: Updaters) => CurriedPropsAdder<TProps, TState & {
    [K in keyof Updaters]: (...args: Parameters<ReturnType<Updaters[K]>>) => void;
}>;
declare const addStateHandlers: AddStateHandlersType;
export default addStateHandlers;
