import { CurriedUnchangedProps } from './helperTypes';
type AddDisplayNameType = <TProps extends {}>(displayName: string) => CurriedUnchangedProps<TProps>;
export declare const isAddDisplayName: (func: Function) => [string] | false;
declare const addDisplayName: AddDisplayNameType;
export default addDisplayName;
