import {useLayoutEffect} from 'react'

addLayoutEffect = (callback, changeProps) -> (props) ->
  useLayoutEffect callback(props),
    # TODO: throw nice error if changeProps isn't array/iterable or any changeProp isn't a string?
    if changeProps?
      props[changeProp] for changeProp in changeProps

  props

export default addLayoutEffect
