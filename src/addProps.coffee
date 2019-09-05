import {isFunction, get} from './util/helpers'
import useMemoized from './util/useMemoized'
import usePrevious from './util/usePrevious'
import {useRef} from 'react'

addProps = (updater, dependencies) -> (props) ->
  getAddedProps = ->
    if isFunction updater then updater props else updater

  addedProps = if dependencies
    if isFunction dependencies
      prevProps = usePrevious props
      computedValueRef = useRef()
      changed = not prevProps? or dependencies prevProps, props
      value = if changed
        getAddedProps()
      else
        computedValueRef.current
      computedValueRef.current = value
    else
      useMemoized(
        getAddedProps
        (get(dependencyName) props for dependencyName in dependencies)
      )
  else
    getAddedProps()

  {
    ...props
    ...addedProps
  }

export default addProps
