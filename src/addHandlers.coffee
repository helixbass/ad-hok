import {mapValues as fmapValues} from 'lodash/fp'

addHandlers = (handlers) -> (props) ->
  {
    ...props,
    ...fmapValues((createHandler) ->
      (...args) ->
        handler = createHandler props
        handler args
    )(handlers)
  }

export default addHandlers
