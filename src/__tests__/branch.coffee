import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import {branch, flowMax, renderNothing, addStateHandlers, addState} from '..'

Comp = flowMax(
  branch(
    ({a}) -> a > 2
    (props) -> {...props, a: 999}
    (props) -> {...props, a: -888}
  )
  ({a, testId}) ->
    <div data-testid={testId}>{a}</div>
)

Brancher = flowMax(
  addStateHandlers {abort: no}, toggleAbort: ({abort}) -> -> abort: not abort
  branch (({abort}) -> abort), renderNothing()
  addState 'unused', 'setUnused'
  ({a, testId, toggleAbort}) ->
    <div>
      <div data-testid={testId}>{a}</div>
      <button onClick={toggleAbort}>toggle abort</button>
    </div>
)

Brancher2 = flowMax(
  branch (({abort}) -> abort), renderNothing()
  addState 'unused', 'setUnused'
  ({a, testId, toggleAbort}) ->
    <div>
      <div data-testid={testId}>{a}</div>
      <button onClick={toggleAbort}>toggle abort</button>
    </div>
)

describe 'branch', ->
  test 'works when test passes', ->
    testId = 'pass'
    {getByTestId} = render <Comp a={3} testId={testId} />
    expect(getByTestId testId).toHaveTextContent '999'

  test 'works when test fails', ->
    testId = 'fail'
    {getByTestId} = render <Comp a={1} testId={testId} />
    expect(getByTestId testId).toHaveTextContent '-888'

  test 'works with renderNothing()', ->
    testId = 'renderNothing-branch'
    {
      getByTestId
      getByText
      queryByTestId
    } = render <Brancher a={1} testId={testId} />
    expect(getByTestId testId).toHaveTextContent '1'
    fireEvent.click getByText /toggle abort/
    expect(queryByTestId testId).toBeNull()

  test 'works with renderNothing() when initially rendering nothing', ->
    testId = 'renderNothing-branch-initial-abort'
    OuterState = flow(
      addStateHandlers
        abort: yes
      ,
        toggleAbort: ({abort}) -> -> abort: not abort
      ({abort, toggleAbort}) ->
        <div>
          <Brancher2 abort={abort} a={2} testId={testId} />
          <button onClick={toggleAbort}>toggle abort</button>
        </div>
    )
    {getByTestId, getByText, queryByTestId} = render <OuterState />
    expect(queryByTestId testId).toBeNull()
    fireEvent.click getByText /toggle abort/
    expect(getByTestId testId).toHaveTextContent '2'
