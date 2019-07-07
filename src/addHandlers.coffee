import {mapValues, map} from 'lodash/fp'
import {useMemo} from 'react'

addHandlers = (handlers, dependencyNames) ->
  prevDependencies = null
  prevHandlerProps = null
  (props) ->
    createHandlerProps = ->
      mapValues((createHandler) ->
        (...args) ->
          handler = createHandler props
          handler ...args
      ) handlers

    hasChanged = (dependencies) ->
      console.warn {prevDependencies}
      return yes unless prevDependencies?
      for dependency, index in dependencies when (
        dependency isnt prevDependencies[index]
      )
        console.warn changed: dependency, name: dependencyNames[index]
        return yes
      console.warn "didn't change"
      no

    handlerProps = if dependencyNames
      dependencies =
        map((dependencyName) -> props[dependencyName]) dependencyNames

      # if hasChanged dependencies
      #   createHandlerProps()
      # else
      #   prevHandlerProps
      useMemo createHandlerProps, dependencies
    else
      createHandlerProps()

    # if hasChanged dependencies
    #   console.warn 'dependencies changed'
    # else
    #   console.warn 'dependencies stayed same'
    # if prevHandlerProps is handlerProps
    #   console.warn 'stayed same'
    # else
    #   console.warn 'changed'
    prevDependencies = dependencies
    prevHandlerProps = handlerProps

    {
      ...props
      ...handlerProps
    }

export default addHandlers
