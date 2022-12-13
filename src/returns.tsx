import {CurriedUnchangedProps} from './helperTypes'

const key = '__ad-hok-returns'

export const isReturns = (props: {}): [unknown] | false => {
  try {
    if (!(key in props)) return false
    return [(props as any)[key]]
  } catch {
    return false
  }
}

type ReturnsType = <TProps extends {}, TReturn>(
  callback: (props: TProps) => TReturn,
) => (
  props: TProps,
) => {
  [key in typeof key]: TReturn
}

export const returns: ReturnsType = (callback) => (props) => ({
  [key]: callback(props),
})

type ReturnsPublishedType = <TProps extends {}>(
  callback: (props: TProps) => unknown,
) => CurriedUnchangedProps<TProps>

const returnsPublishedType = returns as ReturnsPublishedType
export default returnsPublishedType
