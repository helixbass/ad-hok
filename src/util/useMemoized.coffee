import usePrevious from './usePrevious'
import {useRef} from 'react'

shallowEqualArray = (a, b) ->
  return no unless a?.length? and b?.length?
  return no unless a.length is b.length
  for element, index in a
    return no unless element is b[index]
  yes

useMemoized = (compute, dependencies) ->
  memoizedValueRef = useRef()
  prevDependencies = usePrevious dependencies
  unless shallowEqualArray prevDependencies, dependencies
    memoizedValueRef.current = compute()
  memoizedValueRef.current

export default useMemoized
