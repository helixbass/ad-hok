import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {branch, flowMax, renderNothing} from '..'

const Comp: FC<{
  a: number
  testId: string
}> = flowMax(
  branch(({a}) => a > 2, renderNothing()),
  ({a, testId}) => <div data-testid={testId}>{a}</div>,
)

describe('renderNothing', () => {
  test('works', () => {
    const testId = 'pass'
    const {rerender} = render(<Comp a={3} testId={testId} />)
    expect(screen.queryByTestId(testId)).toBeNull()
    rerender(<Comp a={1} testId={testId} />)
    expect(screen.queryByTestId(testId)).toHaveTextContent('1')
  })
})
