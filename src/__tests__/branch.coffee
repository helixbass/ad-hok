import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'

import {branch, flowMax} from '..'

Comp = flowMax(
  branch(
    ({a}) -> a > 2
    (props) -> {...props, a: 999}
    (props) -> {...props, a: -888}
  )
  ({a, testId}) ->
    <div data-testid={testId}>{a}</div>
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
