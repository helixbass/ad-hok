import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import {addCallback, addState} from '..'

Comp = flow(
  addState 'inputNode', 'setInputNode'
  addCallback(
    'inputCallbackRef'
    ({setInputNode}) -> (node) ->
      setInputNode node
    []
  )
  ({inputCallbackRef, inputNode}) ->
    <div>
      <input data-testid="input" ref={inputCallbackRef} />
      <button onClick={-> inputNode.focus()}>update</button>
    </div>
)

describe 'addCallback', ->
  test 'works', ->
    {getByText, getByTestId} = render <Comp />
    fireEvent.click getByText /update/
    expect(document.activeElement).toBe getByTestId 'input'
