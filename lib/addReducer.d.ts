import { Reducer } from 'react';
import { ValueOrFunctionOfProps } from './helperTypes';
type AddReducerType = <TState extends {}, TAction, TProps extends {}>(reducer: Reducer<TState, TAction>, initialState: ValueOrFunctionOfProps<TState, TProps>) => (props: TProps) => TProps & TState & {
    dispatch: (action: TAction) => void;
};
declare const addReducer: AddReducerType;
export default addReducer;
