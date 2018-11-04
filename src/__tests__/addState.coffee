import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import addState from '../addState'

Comp = flow addState('x', 'setX', 'abcd'), ({x, setX}) ->
  <div>
    <div data-testid="a">{x}</div>
    <button onClick={-> setX 'efg'}>update</button>
  </div>

describe 'addState', ->
  test 'initial state', ->
    {getByTestId} = render <Comp />
    expect(getByTestId 'a').toHaveTextContent 'abcd'

  test 'setter', ->
    {getByText, getByTestId} = render <Comp />
    fireEvent.click getByText /update/
    expect(getByTestId 'a').toHaveTextContent 'efg'
