import React, {createFactory} from 'react'
import {render, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import {addState, addEffect} from '..'

# eslint-disable-next-line coffee/prop-types
DisplayComp = ({x}) ->
  <div>
    <div data-testid="a">{x}</div>
  </div>

Comp = flow(
  addState 'x', 'setX', 'aaa'
  addEffect ({setX}) ->
    ->
      # axios.get.mockResolvedValueOnce data: greeting: 'ddd'
      # {data: {greeting}} = await axios.get 'SOME_URL'
      setX 'ddd'
  createFactory DisplayComp
)

Comp2 = flow(
  addState 'x', 'setX', 0
  addEffect(
    ({x, setX}) ->
      ->
        setX x + 1
    []
  )
  ({x, testId}) ->
    <div data-testid={testId}>{x}</div>
)

Comp3 = flow(
  addState 'x', 'setX', 0
  addEffect(
    ({x, setX}) ->
      ->
        setX x + 1
    ['y']
  )
  ({x, testId}) ->
    <div data-testid={testId}>{x}</div>
)

describe 'addEffect', ->
  test 'fires', ->
    {getByText, rerender} = render <Comp />
    rerender <Comp />
    updatedEl = await waitForElement -> getByText 'ddd'
    expect(updatedEl).toHaveTextContent 'ddd'

  test 'passes changed-props arg to useEffect()', ->
    testId = 'comp2'
    {rerender, getByTestId} = render <Comp2 testId={testId} />
    expect(getByTestId testId).toHaveTextContent '1'
    rerender <Comp2 testId={testId} />
    expect(getByTestId testId).toHaveTextContent '1'

  test 'treats changed-props string arg as prop name', ->
    testId = 'comp3'
    {getByTestId, rerender} = render <Comp3 y={1} z={2} testId={testId} />
    expect(getByTestId testId).toHaveTextContent '1'
    rerender <Comp3 y={1} z={3} testId={testId} />
    expect(getByTestId testId).toHaveTextContent '1'
    rerender <Comp3 y={2} z={3} testId={testId} />
