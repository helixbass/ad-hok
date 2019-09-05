import {mapValues} from './util/helpers'
import useComputedFromDependencies from './util/useComputedFromDependencies'

addHandlers = (handlers, dependencies) ->
  (props) ->
    createHandlerProps = ->
      mapValues((createHandler) ->
        handler = createHandler props
        (...args) ->
          handler ...args
      ) handlers

    handlerProps = useComputedFromDependencies {
      compute: createHandlerProps
      dependencies
      props
    }

    {
      ...props
      ...handlerProps
    }

export default addHandlers
