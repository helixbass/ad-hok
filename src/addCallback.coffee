import {useCallback} from 'react'

addCallback = (name, callback, dependencies) -> (props) ->
  curriedCallback = useCallback callback(props), dependencies
  {...props, [name]: curriedCallback}

export default addCallback
