import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'

import {addState, addWrapper, addProps, flowMax} from '..'

Comp = flowMax addState('x', 'setX', 'abcd'), ({x, setX}) ->
  <div>
    <div data-testid="a">{x}</div>
    <button onClick={-> setX 'efg'}>update</button>
  </div>

addStuff = flowMax(
  addWrapper ({render: _render, props}) ->
    <div>
      <div data-testid="passed-z">{props.z}</div>
      {_render y: 2}
    </div>
  addProps d: 4
)

Outer = flowMax addStuff, ({y, d, e}) ->
  <div>
    <div data-testid="child-y">{y}</div>
    <div data-testid="child-d">{d}</div>
    <div data-testid="child-e">{e}</div>
  </div>

describe 'flowMax', ->
  test 'works in place of flow()', ->
    {getByText, getByTestId} = render <Comp />
    fireEvent.click getByText /update/
    expect(getByTestId 'a').toHaveTextContent 'efg'

  test 'nesting with magic helpers', ->
    {getByTestId} = render <Outer z={3} e={5} />
    expect(getByTestId 'passed-z').toHaveTextContent '3'
    expect(getByTestId 'child-y').toHaveTextContent '2'
    expect(getByTestId 'child-d').toHaveTextContent '4'
    expect(getByTestId 'child-e').toHaveTextContent '5'
