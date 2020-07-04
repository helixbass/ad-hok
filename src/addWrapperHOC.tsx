import React, {ComponentType} from 'react'

import {CurriedPropsAdder} from 'helperTypes'

const markerPropertyName = '__ad-hok-addWrapperHOC'

export const isAddWrapperHOC = (func: Function): boolean =>
  markerPropertyName in func

export type PropAddingHOCType<AddedProps> = (
  component: ComponentType<any>,
) => ComponentType<any>

type AddWrapperHOCType = <AddedProps, TProps>(
  hoc: PropAddingHOCType<AddedProps>,
) => CurriedPropsAdder<TProps, AddedProps>

const addWrapperHOC = ((hoc, {displayName = 'addWrapperHOC()'} = {}) => {
  const ret = (Component: ComponentType) => {
    const WrappedComponent = hoc(Component)
    WrappedComponent.displayName = displayName

    return (props: any) => <WrappedComponent {...props} />
  }
  ;(ret as any)[markerPropertyName] = true
  return ret
}) as AddWrapperHOCType

export default addWrapperHOC
