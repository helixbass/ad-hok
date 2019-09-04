import {mapValues} from './util/helpers'
import useMemoized from './util/useMemoized'

addHandlers = (handlers, dependencyNames) ->
  (props) ->
    createHandlerProps = ->
      mapValues((createHandler) ->
        handler = createHandler props
        (...args) ->
          handler ...args
      ) handlers

    handlerProps = if dependencyNames
      useMemoized(
        createHandlerProps
        (props[dependencyName] for dependencyName in dependencyNames)
      )
    else
      createHandlerProps()

    {
      ...props
      ...handlerProps
    }

export default addHandlers
