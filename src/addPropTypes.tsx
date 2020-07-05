import React, {ComponentType, FC} from 'react'
import {ValidationMap} from 'prop-types'

import {UnchangedProps} from './helperTypes'

const markerPropertyName = '__ad-hok-addPropTypes'

export const isAddPropTypes = (func: Function): boolean =>
  markerPropertyName in func

type AddPropTypesType = <TPropTypes, TProps>(
  propTypes: ValidationMap<TPropTypes>,
) => UnchangedProps<TProps>

export const addPropTypes = <TPropTypes, TProps>(
  propTypes: TPropTypes,
): ((Component: ComponentType<TProps>) => FC<TProps>) => {
  const ret = (Component: ComponentType<TProps>) => {
    Component.propTypes = propTypes
    return (props: TProps) => <Component {...props} />
  }
  ;(ret as any)[markerPropertyName] = true
  return ret
}

const addPropTypesPublishedType = addPropTypes as AddPropTypesType
export default addPropTypesPublishedType
