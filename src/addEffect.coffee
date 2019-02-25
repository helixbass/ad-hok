import {useEffect} from 'react'

addEffect = (callback, changeProps) -> (props) ->
  useEffect callback(props), changeProps

  props

export default addEffect
