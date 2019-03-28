key = '__ad-hok-returns'

# eslint-disable-next-line known-imports/no-unused-vars
export isReturns = (val) ->
  try
    return no unless key of val
    return [yes, val[key]]
  catch
    return no

export default (val) -> ->
  [key]: val
