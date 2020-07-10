import {CurriedUnchangedProps} from './helperTypes'

const markerPropertyName = '__ad-hok-addDisplayName'

type AddDisplayNameType = <TProps>(
  displayName: string,
) => CurriedUnchangedProps<TProps>

export const isAddDisplayName = (func: Function): [string] | false =>
  markerPropertyName in func && (func as any)[markerPropertyName]

const addDisplayName: AddDisplayNameType = (displayName) => {
  const ret = <TProps,>(props: TProps) => props
  ;(ret as any)[markerPropertyName] = [displayName]
  return ret
}

export default addDisplayName
