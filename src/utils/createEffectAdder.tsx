import {useEffect, useLayoutEffect} from 'react'

import isArray from './isArray'
import get from './get'
import shallowEqualArray from './shallowEqualArray'
import usePrevious from './usePrevious'
import {CurriedUnchangedProps, DependenciesArgument} from '../helperTypes'

const isSimpleDependenciesArray = (
  dependencies: string[] | Function | undefined,
): boolean => {
  if (!isArray(dependencies)) return false
  for (const dependency of dependencies) {
    if (dependency.indexOf('.') > -1) {
      return false
    }
  }
  return true
}

type CreateEffectAdderType = (
  effectHook: typeof useEffect | typeof useLayoutEffect,
) => <TProps>(
  callback: (props: TProps) => () => void | (() => void | undefined),
  dependencies?: DependenciesArgument<TProps>,
) => CurriedUnchangedProps<TProps>

export type AddEffectType = ReturnType<CreateEffectAdderType>

const createEffectAdder: CreateEffectAdderType = (effectHook) => (
  callback,
  dependencies,
) => {
  const isDependenciesSimpleArray = isSimpleDependenciesArray(dependencies)

  return (props) => {
    const prevProps = usePrevious(props)
    if (!dependencies) {
      effectHook(callback(props))
    } else if (isArray(dependencies) && isDependenciesSimpleArray) {
      // TODO: throw nice error if changeProps isn't array/iterable or any changeProp isn't a string?
      effectHook(
        callback(props),
        dependencies.map(
          (dependencyPropName) => (props as any)[dependencyPropName],
        ),
      )
    } else {
      if (isArray(dependencies)) {
        effectHook(() => {
          if (
            prevProps != null &&
            shallowEqualArray(
              dependencies.map((dependencyName) =>
                get(dependencyName, prevProps),
              ),
              dependencies.map((dependencyName) => get(dependencyName, props)),
            )
          )
            return

          return callback(props)()
        })
      } else {
        effectHook(() => {
          if (prevProps != null && !dependencies(prevProps, props)) return

          return callback(props)()
        })
      }
    }

    return props
  }
}

export default createEffectAdder
