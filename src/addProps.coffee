import {isFunction} from './util/helpers'
import useComputedFromDependencies from './util/useComputedFromDependencies'

addProps = (updater, dependencies) -> (props) ->
  getAddedProps = ->
    if isFunction updater then updater props else updater

  addedProps = useComputedFromDependencies {
    compute: getAddedProps
    dependencies
    props
  }

  {
    ...props
    ...addedProps
  }

export default addProps
