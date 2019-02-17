import {isFunction} from 'lodash'

addProps = (updater) -> (props) ->
  {
    ...props
    ...(if isFunction updater then updater props else updater)
  }

export default addProps
