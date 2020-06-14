import {useState} from 'react'

import {isFunction} from './util/helpers'
import useMemoized from './util/useMemoized'

addState = (name, setterName, initial) ->
  (props) ->
    computedInitial = useMemoized(
      ->
        if isFunction initial
          initial props
        else
          initial
    ,
      []
    )
    [state, setter] = useState computedInitial
    {...props, [name]: state, [setterName]: setter}

export default addState
