import {mapValues} from 'lodash/fp'
import {useMemo} from 'react'

addHandlers = (handlers, dependencyNames) ->
  (props) ->
    createHandlerProps = ->
      mapValues((createHandler) ->
        (...args) ->
          handler = createHandler props
          handler ...args
      ) handlers

    handlerProps = if dependencyNames
      useMemo(
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
