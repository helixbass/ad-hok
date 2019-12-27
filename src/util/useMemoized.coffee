import {useRef} from 'react'

import usePrevious from './usePrevious'
import {shallowEqualArray} from './helpers'

useMemoized = (compute, dependencies) ->
  memoizedValueRef = useRef()
  prevDependencies = usePrevious dependencies
  unless shallowEqualArray prevDependencies, dependencies
    memoizedValueRef.current = compute()
  memoizedValueRef.current

export default useMemoized
