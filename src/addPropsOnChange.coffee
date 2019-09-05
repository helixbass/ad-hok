import addProps from './addProps'

addPropsOnChange = (didChange, getProps) ->
  return addProps getProps, didChange

export default addPropsOnChange
