import { ValueOrFunctionOfProps, CurriedPropsAdder } from './helperTypes';
interface StateUpdaters<TProps, TState> {
    [key: string]: (state: TState, props: TProps) => (...args: any[]) => Partial<TState>;
}
declare type AddStateHandlersPublishedType = <Updaters extends StateUpdaters<TProps, TState>, TProps, TState>(initialState: ValueOrFunctionOfProps<TState, TProps>, stateUpdaters: Updaters) => CurriedPropsAdder<TProps, TState & {
    [handlerName in keyof Updaters]: ReturnType<Updaters[handlerName]>;
}>;
declare const addStateHandlersPublishedType: AddStateHandlersPublishedType;
export default addStateHandlersPublishedType;
