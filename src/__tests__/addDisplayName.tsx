import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {
  addDisplayName,
  flowMax,
  addProps,
  addPropTypes,
  branch,
  renderNothing,
  addWrapper,
} from '..'

const InitialDisplayName: FC<{
  testId: string
}> = flowMax(
  addDisplayName('Initial'),
  addProps({
    a: 3,
  }),
  ({a, testId}) => <div data-testid={testId}>{a}</div>,
)

const NonInitialDisplayName: FC<{
  testId: string
}> = flowMax(
  addProps({
    a: 4,
  }),
  addDisplayName('NonInitial'),
  ({a, testId}) => <div data-testid={testId}>{a}</div>,
)

const WithAddPropTypes: FC = flowMax(
  addDisplayName('WithAddPropTypes'),
  addPropTypes({}),
  () => <div />,
)

const WithBranch: FC = flowMax(
  addDisplayName('WithBranch'),
  branch(() => false, renderNothing()),
  () => <div />,
)

const WithAddWrapper: FC = flowMax(
  addDisplayName('WithAddWrapper'),
  addWrapper((_render) => _render()),
  () => <div />,
)

const WithBranchAndAddWrapper: FC = flowMax(
  addDisplayName('WithBranchAndAddWrapper'),
  addWrapper((_render) => _render()),
  branch(() => false, renderNothing()),
  () => <div />,
)

const NoDisplayNameBranchAndAddWrapper: FC = flowMax(
  addWrapper((_render) => _render()),
  branch(() => false, renderNothing()),
  () => <div />,
)

describe('addDisplayName', () => {
  test('works as initial step', () => {
    expect(InitialDisplayName.displayName).toBe('Initial')
    const testId = 'initial-step'
    render(<InitialDisplayName testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
  })

  test('works as non-initial step', () => {
    expect(NonInitialDisplayName.displayName).toBe('NonInitial')
    const testId = 'non-initial-step'
    render(<NonInitialDisplayName testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('4')
  })

  test('carries across addPropTypes()', () => {
    expect(WithAddPropTypes({})!.type.displayName).toEqual(
      'addPropTypes(WithAddPropTypes)',
    )
  })

  test('carries across branch()', () => {
    expect(WithBranch({})!.type.displayName).toEqual('branch(WithBranch)')
  })

  test('carries across addWrapper()', () => {
    expect(WithAddWrapper({})!.type.displayName).toEqual(
      'addWrapper(WithAddWrapper)',
    )
  })

  test('carries across branch() + addWrapper()', () => {
    expect(WithBranchAndAddWrapper({})!.type().type.displayName).toEqual(
      'branch(addWrapper(WithBranchAndAddWrapper))',
    )
  })

  test('branch() + addWrapper() with no explicit display name', () => {
    expect(
      NoDisplayNameBranchAndAddWrapper({})!.type().type.displayName,
    ).toEqual('branch(addWrapper())')
  })
})
