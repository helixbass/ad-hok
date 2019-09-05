import {useRef} from 'react'
import {isFunction, get} from './helpers'
import usePrevious from './usePrevious'
import useMemoized from './useMemoized'

useComputedFromDependencies = ({compute, dependencies, props}) ->
  if dependencies
    if isFunction dependencies
      prevProps = usePrevious props
      computedValueRef = useRef()
      changed = not prevProps? or dependencies prevProps, props
      value = if changed
        compute()
      else
        computedValueRef.current
      computedValueRef.current = value
    else
      useMemoized(
        compute
        (get(dependencyName) props for dependencyName in dependencies)
      )
  else
    compute()

export default useComputedFromDependencies
