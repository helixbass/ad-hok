import React, {useRef} from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import addHandlers from '../addHandlers'

Comp = flow(
  addHandlers
    onClick: ({onClick}) -> (num) ->
      onClick num * 2
  ({onClick}) ->
    <div>
      <button onClick={-> onClick 3}>update</button>
    </div>
)

Outer = ->
  inputRef = useRef()
  <div>
    <input data-testid="input" ref={inputRef} />
    <Comp onClick={(val) -> inputRef.current.value = val} />
  </div>

describe 'addHandlers', ->
  test 'works', ->
    {getByText, getByTestId} = render <Outer />

    fireEvent.click getByText /update/
    expect(getByTestId('input').value).toBe '6'
