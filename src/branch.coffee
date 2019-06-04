import React from 'react'
import flowMax from './flowMax'
import {markerPropertyName} from './branch-avoid-circular-dependency'

export default (test, consequent, alternate = (props) -> props) ->
  ret = (Component) ->
    ConsequentAsComponent = flowMax consequent, Component
    if (
      not ConsequentAsComponent.displayName? or
      ConsequentAsComponent.displayName is 'ret'
    )
      ConsequentAsComponent.displayName = "branch(#{Component.displayName ?
        ''})"
    AlternateAsComponent = flowMax alternate, Component
    if (
      not AlternateAsComponent.displayName? or
      AlternateAsComponent.displayName is 'ret'
    )
      AlternateAsComponent.displayName = "branch(#{Component.displayName ? ''})"
    (props) ->
      if test props
        <ConsequentAsComponent {...props} />
      else
        <AlternateAsComponent {...props} />
  ret[markerPropertyName] = yes
  ret
