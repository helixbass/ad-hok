import {useRef} from 'react'

import {isFunction} from './util/helpers'
import useMemoized from './util/useMemoized'

addRef = (name, initialValue) ->
  (props) ->
    computedInitialValue = useMemoized(
      ->
        if isFunction initialValue
          initialValue props
        else
          initialValue
    ,
      []
    )
    ref = useRef computedInitialValue
    {...props, [name]: ref}

export default addRef
