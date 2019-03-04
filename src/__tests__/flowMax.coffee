import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'

import addState from '../addState'
import flowMax from '../flowMax'

Comp = flowMax addState('x', 'setX', 'abcd'), ({x, setX}) ->
  <div>
    <div data-testid="a">{x}</div>
    <button onClick={-> setX 'efg'}>update</button>
  </div>

describe 'flowMax', ->
  test 'works in place of flow()', ->
    {getByText, getByTestId} = render <Comp />
    fireEvent.click getByText /update/
    expect(getByTestId 'a').toHaveTextContent 'efg'
