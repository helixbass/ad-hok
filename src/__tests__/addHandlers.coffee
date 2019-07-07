### eslint-disable no-console ###
import React, {useRef} from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import {addHandlers, addState} from '..'

Comp = flow(
  addHandlers
    onClick: ({onClick}) -> (num) ->
      onClick num * 2
  ({onClick}) ->
    <div>
      <button onClick={-> onClick 3}>update</button>
    </div>
)

Outer = ->
  inputRef = useRef()
  <div>
    <input data-testid="input" ref={inputRef} />
    <Comp onClick={(val) -> inputRef.current.value = val} />
  </div>

Deps = flow(
  addState 'y', 'setY', 2
  addHandlers
    onClick: ({x, setY}) -> ->
      setY x + 1
  ,
    ['x', 'setY']
  ({onClick, y, testId}) ->
    <div>
      <Pure onClick={onClick} />
      <div data-testid={testId}>{y}</div>
    </div>
)

Pure = React.memo ({onClick}) ->
  console.log 'Pure rerendered'
  <div>
    <button onClick={onClick}>pure button</button>
  </div>

describe 'addHandlers', ->
  test 'works', ->
    {getByText, getByTestId} = render <Outer />

    fireEvent.click getByText /update/
    expect(getByTestId('input').value).toBe '6'

  test 'allows specifying dependencies for stable handler identities across rerenders', ->
    jest
    .spyOn console, 'log'
    .mockImplementation ->

    testId = 'y'
    x = 4
    {rerender, getByText, getByTestId} = render <Deps x={x} testId={testId} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()

    rerender <Deps x={x} testId={testId} />
    expect(console.log).not.toHaveBeenCalled()
    console.log.mockClear()

    fireEvent.click getByText /pure button/
    expect(console.log).not.toHaveBeenCalled()
    console.log.mockClear()
    expect(getByTestId testId).toHaveTextContent '5'

    x = 6
    rerender <Deps x={x} testId={testId} />
    expect(console.log).toHaveBeenCalledTimes 1
    console.log.mockClear()

    fireEvent.click getByText /pure button/
    expect(console.log).not.toHaveBeenCalled()
    console.log.mockClear()
    expect(getByTestId testId).toHaveTextContent '7'
