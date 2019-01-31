import {useRef} from 'react'

addRef = (name, initialValue) ->
  (props) ->
    ref = useRef initialValue
    {...props, [name]: ref}

export default addRef
