import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'

import {
  addDisplayName
  flowMax
  addProps
  addPropTypes
  branch
  renderNothing
  addWrapper
} from '..'

InitialDisplayName = flowMax(
  addDisplayName 'Initial'
  addProps a: 3
  ({a, testId}) ->
    <div data-testid={testId}>{a}</div>
)

NonInitialDisplayName = flowMax(
  addProps a: 4
  addDisplayName 'NonInitial'
  ({a, testId}) ->
    <div data-testid={testId}>{a}</div>
)

WithAddPropTypes = flowMax(
  addDisplayName 'WithAddPropTypes'
  addPropTypes {}
,
  -> <div />
)

WithBranch = flowMax(
  addDisplayName 'WithBranch'
  branch (-> false), renderNothing()
,
  -> <div />
)

WithAddWrapper = flowMax(
  addDisplayName 'WithAddWrapper'
  addWrapper (_render) -> _render()
  -> <div />
)

WithBranchAndAddWrapper = flowMax(
  addDisplayName 'WithBranchAndAddWrapper'
  addWrapper (_render) -> _render()
  branch (-> false), renderNothing()
,
  -> <div />
)

NoDisplayNameBranchAndAddWrapper = flowMax(
  addWrapper (_render) -> _render()
  branch (-> false), renderNothing()
,
  -> <div />
)

### eslint-disable new-cap ###

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

  test 'carries across addPropTypes()', ->
    expect(WithAddPropTypes().type.displayName).toEqual(
      'addPropTypes(WithAddPropTypes)'
    )

  test 'carries across branch()', ->
    expect(WithBranch().type.displayName).toEqual 'branch(WithBranch)'

  test 'carries across addWrapper()', ->
    expect(WithAddWrapper().type.displayName).toEqual(
      'addWrapper(WithAddWrapper)'
    )

  test 'carries across branch() + addWrapper()', ->
    expect(WithBranchAndAddWrapper().type().type.displayName).toEqual(
      'branch(addWrapper(WithBranchAndAddWrapper))'
    )

  test 'branch() + addWrapper() with no explicit display name', ->
    expect(NoDisplayNameBranchAndAddWrapper().type().type.displayName).toEqual(
      'branch(addWrapper())'
    )
