nonce = {}

# eslint-disable-next-line known-imports/no-unused-vars
export isRenderNothing = (val) ->
  val is nonce

export default -> ->
  nonce
