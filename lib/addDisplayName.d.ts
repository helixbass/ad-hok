import { UnchangedProps } from './helperTypes';
declare type AddDisplayNameType = <TProps>(displayName: string) => UnchangedProps<TProps>;
export declare const isAddDisplayName: (func: Function) => [string] | false;
declare const addDisplayName: AddDisplayNameType;
export default addDisplayName;
