import {useRef} from 'react'

import usePrevious from 'utils/usePrevious'
import shallowEqualArray from 'utils/shallowEqualArray'

const useMemoized = <TValue,>(
  compute: () => TValue,
  dependencies: unknown[],
): TValue => {
  const memoizedValueRef = useRef<TValue>()
  const prevDependencies = usePrevious(dependencies)
  if (!shallowEqualArray(prevDependencies, dependencies)) {
    memoizedValueRef.current = compute()
  }
  return memoizedValueRef.current!
}

export default useMemoized
