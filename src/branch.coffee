export default (test, consequent, alternate = (props) -> props) ->
  (props) ->
    if test props
      consequent props
    else
      alternate props
