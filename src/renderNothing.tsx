import {CurriedUnchangedProps} from './helperTypes'

const nonce = {}

export const isRenderNothing = (value: unknown): boolean => value === nonce

type RenderNothingType = <TProps>() => CurriedUnchangedProps<TProps>

const renderNothing: RenderNothingType = () => (props) => nonce as typeof props

export default renderNothing
