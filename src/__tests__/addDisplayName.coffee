import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'

import {addDisplayName, flowMax, addProps} from '..'

InitialDisplayName = flowMax addDisplayName('Initial'), addProps(a: 3), ({
  a
  testId
}) ->
  <div data-testid={testId}>{a}</div>

NonInitialDisplayName = flowMax addProps(a: 4), addDisplayName('NonInitial'), ({
  a
  testId
}) ->
  <div data-testid={testId}>{a}</div>

describe 'addDisplayName', ->
  test 'works as initial step', ->
    expect(InitialDisplayName.displayName).toBe 'Initial'
    testId = 'initial-step'
    {getByTestId} = render <InitialDisplayName testId={testId} />
    expect(getByTestId testId).toHaveTextContent '3'

  test 'works as non-initial step', ->
    expect(NonInitialDisplayName.displayName).toBe 'NonInitial'
    testId = 'non-initial-step'
    {getByTestId} = render <NonInitialDisplayName testId={testId} />
    expect(getByTestId testId).toHaveTextContent '4'
