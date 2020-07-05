import { UnchangedProps } from 'helperTypes';
export declare const isReturns: (props: {}) => [unknown] | false;
declare type ReturnsType = <TProps>(callback: (props: TProps) => unknown) => UnchangedProps<TProps>;
declare const returns: ReturnsType;
export default returns;
