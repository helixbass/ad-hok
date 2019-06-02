import React from 'react'
import flowMax from './flowMax'
import {markerPropertyName} from './branch-avoid-circular-dependency'

export default (test, consequent, alternate = (props) -> props) ->
  ret = (Component) ->
    ConsequentAsComponent = flowMax consequent, Component
    AlternateAsComponent = flowMax alternate, Component
    (props) ->
      if test props
        <ConsequentAsComponent {...props} />
      else
        <AlternateAsComponent {...props} />
  ret[markerPropertyName] = yes
  ret
