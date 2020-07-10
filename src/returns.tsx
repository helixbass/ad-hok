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

type ReturnsType = <TProps>(
  callback: (props: TProps) => unknown,
) => CurriedUnchangedProps<TProps>

const returns: ReturnsType = (callback) => (props) =>
  (({
    [key]: callback(props),
  } as unknown) as typeof props)

export default returns
