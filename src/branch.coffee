import React from 'react'

import flowMax from './flowMax'
import {markerPropertyName} from './branch-avoid-circular-dependency'

export default (test, consequent, alternate = (props) -> props) ->
  ret = (Component) ->
    ConsequentAsComponent = null
    createConsequent = ->
      Consequent = flowMax(
        consequent
        Component
      )
      if not Consequent.displayName? or Consequent.displayName is 'ret'
        Consequent.displayName = "branch(#{Component.displayName ? ''})"
      Consequent
    AlternateAsComponent = null
    createAlternate = ->
      Alternate = flowMax(
        alternate
        Component
      )
      if not Alternate.displayName? or Alternate.displayName is 'ret'
        Alternate.displayName = "branch(#{Component.displayName ? ''})"
      Alternate
    (props) ->
      if test props
        ConsequentAsComponent ?= createConsequent()
        <ConsequentAsComponent {...props} />
      else
        AlternateAsComponent ?= createAlternate()
        <AlternateAsComponent {...props} />
  ret[markerPropertyName] = yes
  ret
