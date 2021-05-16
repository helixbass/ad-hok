import React, {ComponentType, FC} from 'react'

import {CurriedPropsAdder} from './helperTypes'

const markerPropertyName = '__ad-hok-addWrapperHOC'

export const isAddWrapperHOC = (func: Function): boolean =>
  markerPropertyName in func

export type PropAddingHOC<_TAddedProps> = (
  Component: ComponentType<any>,
) => ComponentType<any>

export const addWrapperHOC = <TProps,>(
  hoc: (Component: ComponentType<TProps>) => ComponentType<any>,
  {displayName = 'addWrapperHOC()'} = {},
): ((Component: ComponentType<TProps>) => FC<TProps>) => {
  const ret = (Component: ComponentType<TProps>) => {
    const WrappedComponent = hoc(Component)
    WrappedComponent.displayName = displayName

    return (props: TProps) => <WrappedComponent {...props} />
  }
  ;(ret as any)[markerPropertyName] = true
  return ret
}

type AddWrapperHOCType = <AddedProps, TProps>(
  hoc: PropAddingHOC<AddedProps>,
) => CurriedPropsAdder<TProps, AddedProps>

const addWrapperHOCPublishedType = addWrapperHOC as AddWrapperHOCType
export default addWrapperHOCPublishedType
