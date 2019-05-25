import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import {addState} from '..'

Comp = flow addState('x', 'setX', 'abcd'), ({x, setX}) ->
  <div>
    <div data-testid="a">{x}</div>
    <button onClick={-> setX 'efg'}>update</button>
  </div>

Comp2 = flow addState('x', 'setX', ({initial}) -> initial), ({x}) ->
  <div>
    <div data-testid="b">{x}</div>
  </div>

describe 'addState', ->
  test 'initial state', ->
    {getByTestId} = render <Comp />
    expect(getByTestId 'a').toHaveTextContent 'abcd'

  test 'setter', ->
    {getByText, getByTestId} = render <Comp />
    fireEvent.click getByText /update/
    expect(getByTestId 'a').toHaveTextContent 'efg'

  test 'initial state from props', ->
    {getByTestId} = render <Comp2 initial="aaa" />
    expect(getByTestId 'b').toHaveTextContent 'aaa'
