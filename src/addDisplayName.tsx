import {UnchangedProps} from 'helperTypes'

const markerPropertyName = '__ad-hok-addDisplayName'

type AddDisplayNameType = <TProps>(
  displayName: string,
) => UnchangedProps<TProps>

export const isAddDisplayName = (func: Function): boolean =>
  markerPropertyName in func

const addDisplayName: AddDisplayNameType = (displayName) => {
  const ret = <TProps,>(props: TProps) => props
  ;(ret as any)[markerPropertyName] = [displayName]
  return ret
}

export default addDisplayName
