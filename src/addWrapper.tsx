import React, {ReactElement, ComponentType} from 'react'

import {CurriedPropsAdder} from './helperTypes'

const markerPropertyName = '__ad-hok-addWrapper'

export const isAddWrapper = (func: Function): boolean =>
  markerPropertyName in func

export type AddWrapperRenderCallback<TAdditionalProps> = (
  additionalProps?: TAdditionalProps,
) => ReactElement | null

type AddWrapperCallback<TAdditionalProps, TProps> = (
  render: AddWrapperRenderCallback<TAdditionalProps>,
  props: TProps,
) => ReactElement | null

type AddWrapperPublishedType = <TAdditionalProps, TProps>(
  callback: AddWrapperCallback<TAdditionalProps, TProps>,
) => CurriedPropsAdder<TProps, TAdditionalProps>

export const addWrapper = <TProps, TAdditionalProps>(
  callback: AddWrapperCallback<TAdditionalProps, TProps>,
): ((
  Component: ComponentType<TProps & TAdditionalProps>,
) => (props: TProps) => ReactElement | null) => {
  const ret = (Component: ComponentType<TProps & TAdditionalProps>) => (
    props: TProps,
  ) =>
    callback(
      (additionalProps) => (
        <Component
          {...props}
          {...((additionalProps ?? {}) as TAdditionalProps)}
        />
      ),
      props,
    )
  ;(ret as any)[markerPropertyName] = true
  return ret
}

const addWrapperPublishedType = addWrapper as AddWrapperPublishedType
export default addWrapperPublishedType
