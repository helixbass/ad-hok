import { ValueOrFunctionOfProps, CurriedPropsAdder } from './helperTypes';
type AddStateType = <TState, TStateName extends string, TStateUpdaterName extends string, TProps extends {}>(stateName: TStateName, stateUpdaterName: TStateUpdaterName, initialState: ValueOrFunctionOfProps<TState, TProps>) => CurriedPropsAdder<TProps, {
    [stateName in TStateName]: TState;
} & {
    [stateUpdaterName in TStateUpdaterName]: (state: TState | ((prevState: TState) => TState)) => void;
}>;
declare const addState: AddStateType;
export default addState;
