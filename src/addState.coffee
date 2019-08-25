import {useState} from 'react'
import {isFunction} from './util/helpers'

addState = (name, setterName, initial) ->
  (props) ->
    [state, setter] = useState(
      if isFunction initial then initial props else initial
    )
    {...props, [name]: state, [setterName]: setter}

export default addState
