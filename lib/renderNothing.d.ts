import { UnchangedProps } from './helperTypes';
export declare const isRenderNothing: (value: unknown) => boolean;
declare type RenderNothingType = <TProps>() => UnchangedProps<TProps>;
declare const renderNothing: RenderNothingType;
export default renderNothing;
