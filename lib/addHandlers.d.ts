import { CurriedPropsAdder, DependenciesArgument } from './helperTypes';
export interface HandlerCreators<TProps extends {}> {
    [key: string]: (props: TProps) => (...args: any[]) => any;
}
type AddHandlersType = <TCreators extends HandlerCreators<TProps>, TProps extends {}>(handlerCreators: TCreators, dependencies?: DependenciesArgument<TProps>) => CurriedPropsAdder<TProps, {
    [handlerName in keyof TCreators]: ReturnType<TCreators[handlerName]>;
}>;
declare const addHandlers: AddHandlersType;
export default addHandlers;
