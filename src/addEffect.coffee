import {useEffect} from 'react'
import {isArray, get, shallowEqualArray} from './util/helpers'
import usePrevious from './util/usePrevious'

isSimpleDependenciesArray = (dependencies) ->
  return no unless isArray dependencies
  for element in dependencies
    if element.indexOf('.') > -1
      return no
  yes

addEffect = (callback, dependencies) -> (props) ->
  # eslint-disable-next-line coffee/no-negated-condition
  if not dependencies?
    useEffect callback props
  else if isSimpleDependenciesArray dependencies
    # TODO: throw nice error if changeProps isn't array/iterable or any changeProp isn't a string?
    useEffect(
      callback props
      (props[dependencyPropName] for dependencyPropName in dependencies)
    )
  else
    prevProps = usePrevious props
    if isArray dependencies
      useEffect ->
        return if (
          prevProps? and
          shallowEqualArray(
            (get(dependencyName) prevProps for dependencyName in dependencies)
            (get(dependencyName) props for dependencyName in dependencies)
          )
        )

        callback(props)()
    else
      useEffect ->
        return if prevProps? and not dependencies prevProps, props

        callback(props)()

  props

export default addEffect
