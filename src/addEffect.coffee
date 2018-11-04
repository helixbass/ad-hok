import {useEffect} from 'react'

addEffect = (callback) -> (props) ->
  useEffect callback props

  props

export default addEffect
