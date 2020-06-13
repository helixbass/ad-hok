import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import {addReducer} from '..'

reducer = (state, action) ->
  switch action.type
    when 'increment'
      return count: state.count + 1
    when 'decrement'
      return count: state.count - 1
    else
      throw new Error()

Comp = flow(
  addReducer reducer, count: 0
  ({dispatch, count}) ->
    <div>
      <div data-testid="a">{count}</div>
      <button onClick={-> dispatch type: 'increment'}>increment</button>
    </div>
)

describe 'addState', ->
  test 'initial state', ->
    {getByTestId} = render <Comp />
    expect(getByTestId 'a').toHaveTextContent '0'

  test 'dispatch', ->
    {getByText, getByTestId} = render <Comp />
    fireEvent.click getByText /increment/
    expect(getByTestId 'a').toHaveTextContent '1'

  test 'initial state from props', ->
    Component = flow(
      addReducer reducer, ({count}) -> {count}
      ({dispatch, count}) ->
        <div>
          <div data-testid="b">{count}</div>
          <button onClick={-> dispatch type: 'increment'}>increment</button>
        </div>
    )
    {getByTestId} = render <Component count={3} />
    expect(getByTestId 'b').toHaveTextContent '3'

  test 'initial state only gets computed once', ->
    getInitial = jest.fn -> 1
    Component = flow(
      addReducer reducer, -> count: getInitial()
      ({dispatch, count}) ->
        <div>
          <div data-testid="c">{count}</div>
          <button onClick={-> dispatch type: 'increment'}>increment</button>
        </div>
    )
    {getByTestId, rerender} = render <Component />
    expect(getByTestId 'c').toHaveTextContent '1'
    rerender <Component />
    expect(getInitial).toHaveBeenCalledTimes 1
