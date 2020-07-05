import {useRef} from 'react'

import isFunction from './isFunction'
import get from './get'
import usePrevious from './usePrevious'
import useMemoized from './useMemoized'

const useComputedFromDependencies = <TValue, TProps extends {}>({
  compute,
  dependencies,
  additionalResolvedDependencies = [],
  props,
}: {
  compute: () => TValue
  dependencies?: string[] | ((prevProps: TProps, props: TProps) => boolean)
  additionalResolvedDependencies?: unknown[]
  props: TProps
}): TValue => {
  if (dependencies == null) return compute()
  if (isFunction(dependencies)) {
    const prevProps = usePrevious(props)
    const computedValueRef = useRef<TValue>()
    const didChange = prevProps == null || dependencies(prevProps, props)
    const value = didChange ? compute() : computedValueRef.current!
    computedValueRef.current = value
    return value
  }
  return useMemoized(compute, [
    ...dependencies.map((dependencyName) => get(dependencyName, props)),
    ...additionalResolvedDependencies,
  ])
}

export default useComputedFromDependencies
