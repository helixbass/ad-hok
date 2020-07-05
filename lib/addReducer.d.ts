import { Reducer } from 'react';
import { ValueOrFunctionOfProps } from './helperTypes';
declare type AddReducerType = <TState, TAction, TProps>(reducer: Reducer<TState, TAction>, initialState: ValueOrFunctionOfProps<TState, TProps>) => (props: TProps) => TProps & TState & {
    dispatch: (action: TAction) => void;
};
declare const addReducer: AddReducerType;
export default addReducer;
