import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import addStateHandlers from '../addStateHandlers'

Comp = flow(
  addStateHandlers
    x: 2
  ,
    incrementX: ({x}) -> ({by: amount = 1} = {}) -> x: x + amount
  ({x, incrementX}) ->
    <div>
      <div data-testid="a">{x}</div>
      <button onClick={incrementX}>increment</button>
      <button onClick={-> incrementX by: 2}>two</button>
    </div>
)

Comp2 = flow(
  addStateHandlers
    x: 12
  ,
    incrementX: ({x}, {y = 0}) -> ({by: amount = 1} = {}) -> x: x + amount + y
  ({x, incrementX}) ->
    <div>
      <div data-testid="b">{x}</div>
      <button onClick={incrementX}>incremental</button>
      <button onClick={-> incrementX by: 2}>two more</button>
    </div>
)

Comp3 = flow(
  addStateHandlers(
    ({initialX}) -> x: initialX
    incrementX: ({x}) -> ({by: amount = 1} = {}) -> x: x + amount
  )
  ({x, incrementX}) ->
    <div>
      <div data-testid="c">{x}</div>
      <button onClick={incrementX}>increment</button>
      <button onClick={-> incrementX by: 2}>two</button>
    </div>
)

describe 'addStateHandlers', ->
  test 'initial state', ->
    {getByTestId} = render <Comp />
    expect(getByTestId 'a').toHaveTextContent '2'

  test 'handler', ->
    {getByText, getByTestId} = render <Comp />
    fireEvent.click getByText /increment/
    expect(getByTestId 'a').toHaveTextContent '3'

    fireEvent.click getByText /two/
    expect(getByTestId 'a').toHaveTextContent '5'

  test 'handler passes props', ->
    {getByText, getByTestId} = render <Comp2 y={1} />
    fireEvent.click getByText /incremental/
    expect(getByTestId 'b').toHaveTextContent '14'

    fireEvent.click getByText /two more/
    expect(getByTestId 'b').toHaveTextContent '17'

  test 'initial state based on props', ->
    {getByTestId} = render <Comp3 initialX={9} />
    expect(getByTestId 'c').toHaveTextContent '9'
