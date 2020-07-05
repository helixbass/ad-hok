import { CurriedPropsAdder, DependenciesArgument } from 'helperTypes';
interface HandlerCreators<TProps> {
    [key: string]: (props: TProps) => (...args: any[]) => any;
}
declare type AddHandlersType = <TCreators extends HandlerCreators<TProps>, TProps>(handlerCreators: TCreators, dependencies?: DependenciesArgument<TProps>) => CurriedPropsAdder<TProps, {
    [handlerName in keyof TCreators]: ReturnType<TCreators[handlerName]>;
}>;
declare const addHandlers: AddHandlersType;
export default addHandlers;
