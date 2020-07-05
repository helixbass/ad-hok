import React, {ComponentType, FC} from 'react'

import {addWrapperHOC} from './addWrapperHOC'
import get from './utils/get'
import isFunction from './utils/isFunction'
import some from './utils/some'
import {UnchangedProps, DependenciesArgument} from './helperTypes'

const memo = <TProps,>(
  compare: ((prevProps: TProps, props: TProps) => boolean) | undefined,
) => (Component: ComponentType<TProps>) => React.memo(Component, compare)

const compareDependenciesArray = <TProps,>(dependencies: string[]) => (
  prevProps: TProps,
  props: TProps,
) =>
  !some(
    (dependency) => get(dependency, prevProps) !== get(dependency, props),
    dependencies,
  )

export const addMemoBoundary = <TProps,>(
  dependencies?: DependenciesArgument<TProps>,
): ((Component: ComponentType<TProps>) => FC<TProps>) => {
  const compareFunc =
    isFunction(dependencies) || dependencies == null
      ? dependencies
      : compareDependenciesArray<TProps>(dependencies)

  return addWrapperHOC(memo<TProps>(compareFunc))
}

type AddMemoBoundaryType = <TProps>(
  dependencies?: DependenciesArgument<TProps>,
) => UnchangedProps<TProps>

const addMemoBoundaryPublishedType = addMemoBoundary as AddMemoBoundaryType
export default addMemoBoundaryPublishedType
