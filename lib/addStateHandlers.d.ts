import { ValueOrFunctionOfProps, CurriedPropsAdder } from './helperTypes';
interface StateUpdaters<TProps extends {}, TState extends {}> {
    [key: string]: (state: TState, props: TProps) => (...args: any[]) => Partial<TState>;
}
type AddStateHandlersPublishedType = <Updaters extends StateUpdaters<TProps, TState>, TProps extends {}, TState extends {}>(initialState: ValueOrFunctionOfProps<TState, TProps>, stateUpdaters: Updaters) => CurriedPropsAdder<TProps, TState & {
    [handlerName in keyof Updaters]: ReturnType<Updaters[handlerName]>;
}>;
declare const addStateHandlersPublishedType: AddStateHandlersPublishedType;
export default addStateHandlersPublishedType;
