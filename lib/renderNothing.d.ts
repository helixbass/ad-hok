import { CurriedUnchangedProps } from './helperTypes';
declare const nonce: {};
export declare const isRenderNothing: (value: unknown) => boolean;
type RenderNothingType = <TProps extends {}>() => (props: TProps) => typeof nonce;
export declare const renderNothing: RenderNothingType;
type RenderNothingPublishedType = <TProps extends {}>() => CurriedUnchangedProps<TProps>;
declare const renderNothingPublishedType: RenderNothingPublishedType;
export default renderNothingPublishedType;
