import { CurriedUnchangedProps } from './helperTypes';
declare const key = "__ad-hok-returns";
export declare const isReturns: (props: {}) => [unknown] | false;
type ReturnsType = <TProps extends {}, TReturn>(callback: (props: TProps) => TReturn) => (props: TProps) => {
    [key in typeof key]: TReturn;
};
export declare const returns: ReturnsType;
type ReturnsPublishedType = <TProps extends {}>(callback: (props: TProps) => unknown) => CurriedUnchangedProps<TProps>;
declare const returnsPublishedType: ReturnsPublishedType;
export default returnsPublishedType;
