### eslint-disable no-console ###
import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'

import {addMemoBoundary, addProps, flowMax} from '..'

Comp = flowMax(
  addMemoBoundary()
  addProps ({x}) ->
    console.log 'recomputing y'
    y: x * 2
,
  ({y, testId}) ->
    <div data-testid={testId}>{y}</div>
)

Comp2 = flowMax(
  addMemoBoundary ['x']
  addProps ({x}) ->
    console.log 'recomputing y'
    y: x * 2
,
  ({y, testId}) ->
    <div data-testid={testId}>{y}</div>
)

Comp3 = flowMax(
  addMemoBoundary ['object.x']
  addProps ({object: {x}}) ->
    console.log 'recomputing y'
    y: x * 2
,
  ({y, testId}) ->
    <div data-testid={testId}>{y}</div>
)

Comp4 = flowMax(
  addMemoBoundary (oldProps, newProps) -> newProps.x isnt 3
  addProps ({x}) ->
    console.log 'recomputing y'
    y: x * 2
,
  ({y, testId}) ->
    <div data-testid={testId}>{y}</div>
)

describe 'addMemoBoundary', ->
  test 'with no comparison function or array of dependencies', ->
    jest
    .spyOn console, 'log'
    .mockImplementation ->

    testId = 'nothing'
    {getByTestId, rerender} = render <Comp a={1} x={2} testId={testId} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()
    expect(getByTestId testId).toHaveTextContent '4'

    rerender <Comp a={1} x={2} testId={testId} />
    expect(console.log).not.toHaveBeenCalled()
    console.log.mockClear()

    rerender <Comp a={2} x={3} testId={testId} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()
    expect(getByTestId testId).toHaveTextContent '6'

    undefined

  describe 'with an array of dependencies', ->
    test 'no path dependencies', ->
      jest
      .spyOn console, 'log'
      .mockImplementation ->

      testId = 'no-path-dependencies'
      {getByTestId, rerender} = render <Comp2 a={1} x={2} testId={testId} />
      expect(console.log).toHaveBeenCalledTimes 1
      console.log.mockClear()
      expect(getByTestId testId).toHaveTextContent '4'

      rerender <Comp2 a={2} x={2} testId={testId} />
      expect(console.log).not.toHaveBeenCalled()
      console.log.mockClear()

      rerender <Comp2 a={2} x={3} testId={testId} />
      expect(console.log).toHaveBeenCalledTimes 1
      console.log.mockClear()
      expect(getByTestId testId).toHaveTextContent '6'

      undefined

    test 'path dependencies', ->
      jest
      .spyOn console, 'log'
      .mockImplementation ->

      testId = 'path-dependencies'
      {
        getByTestId
        rerender
      } = render <Comp3 object={a: 1, x: 2} testId={testId} />
      expect(console.log).toHaveBeenCalledTimes 1
      console.log.mockClear()
      expect(getByTestId testId).toHaveTextContent '4'

      rerender <Comp3 object={a: 2, x: 2} testId={testId} />
      expect(console.log).not.toHaveBeenCalled()
      console.log.mockClear()

      rerender <Comp3 object={a: 2, x: 3} testId={testId} />
      expect(console.log).toHaveBeenCalledTimes 1
      console.log.mockClear()
      expect(getByTestId testId).toHaveTextContent '6'

      undefined

  test 'with a comparison function', ->
    jest
    .spyOn console, 'log'
    .mockImplementation ->

    testId = 'function'
    {getByTestId, rerender} = render <Comp4 x={1} testId={testId} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()
    expect(getByTestId testId).toHaveTextContent '2'

    rerender <Comp4 x={2} testId={testId} />
    expect(console.log).not.toHaveBeenCalled()
    console.log.mockClear()

    rerender <Comp4 x={3} testId={testId} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()
    expect(getByTestId testId).toHaveTextContent '6'

    undefined
