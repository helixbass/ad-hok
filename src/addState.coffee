import {useState} from 'react'

addState = (name, setterName, initialValue) ->
  (props) ->
    [state, setter] = useState initialValue
    {...props, [name]: state, [setterName]: setter}

export default addState
