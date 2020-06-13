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
      Consequent.displayName = "branch(#{
        if not Consequent.displayName? or Consequent.displayName is 'ret'
          Component.displayName ? ''
        else
          Consequent.displayName
      })"
      Consequent
    AlternateAsComponent = null
    createAlternate = ->
      Alternate = flowMax(
        alternate
        Component
      )
      Alternate.displayName = "branch(#{
        if not Alternate.displayName? or Alternate.displayName is 'ret'
          Component.displayName ? ''
        else
          Alternate.displayName
      })"
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
