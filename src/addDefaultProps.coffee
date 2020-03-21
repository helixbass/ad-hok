import addProps from './addProps'

addDefaultProps = (defaults) ->
  addProps (props) ->
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
