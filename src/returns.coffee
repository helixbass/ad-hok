key = '__ad-hok-returns'

# eslint-disable-next-line known-imports/no-unused-vars
export isReturns = (val) ->
  try
    return no unless key of val
    return [val[key]]
  catch
    return no

export default (callback) -> (props) ->
  [key]: callback props
