import {isArray, get, shallowEqualArray} from './util/helpers'
import usePrevious from './util/usePrevious'

isSimpleDependenciesArray = (dependencies) ->
  return no unless isArray dependencies
  for element in dependencies
    if element.indexOf('.') > -1
      return no
  yes

createEffectAdder = (effectHook) -> (callback, dependencies) ->
  isDependenciesNullish = not dependencies?
  isDependenciesSimpleArray =
    not isDependenciesNullish and isSimpleDependenciesArray dependencies
  isDependenciesArray =
    not isDependenciesNullish and
    (isDependenciesSimpleArray or isArray dependencies)

  (props) ->
    if isDependenciesNullish
      effectHook callback props
    else if isDependenciesSimpleArray
      # TODO: throw nice error if changeProps isn't array/iterable or any changeProp isn't a string?
      effectHook(
        callback props
        (props[dependencyPropName] for dependencyPropName in dependencies)
      )
    else
      prevProps = usePrevious props
      if isDependenciesArray
        effectHook ->
          return if (
            prevProps? and
            shallowEqualArray(
              (get(dependencyName) prevProps for dependencyName in dependencies)
              (get(dependencyName) props for dependencyName in dependencies)
            )
          )

          callback(props)()
      else
        effectHook ->
          return if prevProps? and not dependencies prevProps, props

          callback(props)()

    props

export default createEffectAdder
