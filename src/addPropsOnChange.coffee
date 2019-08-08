import {isArray} from 'lodash'

import addProps from './addProps'
import usePrevious from './util/usePrevious'

addPropsOnChange = (didChange, getProps) ->
  return addProps getProps, didChange if isArray didChange

  prevAddedProps = null

  (props) ->
    prevProps = usePrevious props
    changed = not prevAddedProps or not prevProps? or didChange prevProps, props
    addedProps = if changed
      getProps props
    else
      prevAddedProps
    prevAddedProps = addedProps

    {
      ...props
      ...addedProps
    }

export default addPropsOnChange
