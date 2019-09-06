### eslint-disable no-console ###
import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import {addProps} from '..'

Comp = flow(
  addProps(
    ({x}) ->
      console.log 'recomputing y'
      y: x * 2
    ['x', 'user.id']
  )
  ({y, testId}) ->
    <div data-testid={testId}>{y}</div>
)

Comp2 = flow(
  addProps(
    ({x}) ->
      console.log 'recomputing y'
      y: x * 2
    (prevProps, props) ->
      props.x > prevProps.x
  )
  ({y, testId}) ->
    <div data-testid={testId}>{y}</div>
)

describe 'addProps', ->
  test 'adds object', ->
    expect(addProps(b: 2) a: 1, b: 3).toEqual a: 1, b: 2

  test 'adds function', ->
    expect(addProps(({b}) -> b: b + 1) a: 1, b: 2).toEqual a: 1, b: 3

  test 'works with dependencies list', ->
    jest
    .spyOn console, 'log'
    .mockImplementation ->

    testId = 'basic'
    {
      getByTestId
      rerender
    } = render <Comp x={2} z={3} testId={testId} user={id: 3} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()
    expect(getByTestId testId).toHaveTextContent '4'

    rerender <Comp x={2} z={5} testId={testId} user={id: 3} />
    expect(console.log).not.toHaveBeenCalled()
    console.log.mockClear()

    rerender <Comp x={4} z={5} testId={testId} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()
    expect(getByTestId testId).toHaveTextContent '8'

    rerender <Comp x={4} z={5} testId={testId} user={id: 4} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()
    undefined

  test 'works with dependencies callback', ->
    jest
    .spyOn console, 'log'
    .mockImplementation ->

    testId = 'dependencies-callback'
    {getByTestId, rerender} = render <Comp2 x={2} z={3} testId={testId} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()
    expect(getByTestId testId).toHaveTextContent '4'

    rerender <Comp2 x={1} z={5} testId={testId} />
    expect(console.log).not.toHaveBeenCalled()
    console.log.mockClear()

    rerender <Comp2 x={4} z={5} testId={testId} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()
    expect(getByTestId testId).toHaveTextContent '8'
