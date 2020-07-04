import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {branchPure, flowMax} from '..'

const Comp: FC<{
  a: number
  testId: string
}> = flowMax(
  branchPure(
    ({a}) => a > 2,
    (props) => ({...props, a: 999}),
    (props) => ({...props, a: -888}),
  ),
  ({a, testId}) => <div data-testid={testId}>{a}</div>,
)

describe('branchPure', () => {
  test('works when test passes', () => {
    const testId = 'pass'
    render(<Comp a={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('999')
  })

  test('works when test fails', () => {
    const testId = 'fail'
    render(<Comp a={1} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('-888')
  })
})
