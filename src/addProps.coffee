import {isFunction} from './util/helpers'
import useMemoized from './util/useMemoized'

addProps = (updater, dependencyNames) -> (props) ->
  getAddedProps = ->
    if isFunction updater then updater props else updater

  addedProps = if dependencyNames
    useMemoized(
      getAddedProps
      (props[dependencyName] for dependencyName in dependencyNames)
    )
  else
    getAddedProps()

  {
    ...props
    ...addedProps
  }

export default addProps
