import {useRef, useEffect} from 'react'

usePrevious = (val) ->
  ref = useRef()
  useEffect ->
    ref.current = val
    undefined
  ref.current

export default usePrevious
