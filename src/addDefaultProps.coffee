import {isFunction} from './util/helpers'
import addProps from './addProps'

addDefaultProps = (createDefaults) ->
  addProps (props) ->
    defaults = if isFunction createDefaults
      createDefaults props
    else
      createDefaults

    newProps = {}

    for key, val of defaults when not props[key]?
      newProps[key] = val

    newProps

export default addDefaultProps
