import {isFunction} from './util/helpers'
import addProps from './addProps'

addDefaultProps = (createDefaults) ->
  addProps (props) ->
    defaults = if isFunction createDefaults
      createDefaults props
    else
      createDefaults

    Object.keys(defaults).reduce(
      (newProps, key) ->
        if props[key] is null or props[key] is undefined
          {...newProps, [key]: defaults[key]}
        else
          newProps
    ,
      {}
    )

export default addDefaultProps
