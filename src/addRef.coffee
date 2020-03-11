import {useRef} from 'react'

import {isFunction} from './util/helpers'

addRef = (name, initialValue) ->
  (props) ->
    ref = useRef(
      if isFunction initialValue then initialValue props else initialValue
    )
    {...props, [name]: ref}

export default addRef
