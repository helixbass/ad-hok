import {useContext} from 'react'

addContext = (context, name) ->
  (props) ->
    value = useContext context
    {...props, [name]: value}

export default addContext
