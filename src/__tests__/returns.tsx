import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {flowMax, returns, branchPure, branch} from '..'

describe('returns', () => {
  test('works as initial step', () => {
    const returnPlusTwo: (num: number) => number = flowMax(
      returns((val) => val + 2),
      () => 4,
    )
    const ret = returnPlusTwo(1)

    expect(ret).toBe(3)
  })

  test('works as non-initial step', () => {
    const ret = flowMax(
      () => 2,
      returns((val) => val + 1),
      () => 4,
    )(1)

    expect(ret).toBe(3)
  })

  test('works with branchPure()', () => {
    const returnThreeIfGreaterThanOne: (num: number) => number = flowMax(
      branchPure(
        (x) => x > 1,
        returns((val) => val + 1),
      ),
      () => 4,
    )

    let ret = returnThreeIfGreaterThanOne(2)
    expect(ret).toBe(3)

    ret = returnThreeIfGreaterThanOne(1)
    expect(ret).toBe(4)
  })

  test('works with branch()', () => {
    const Comp: FC<{
      x: number
      testId: string
    }> = flowMax(
      branch(
        ({x}) => x > 2,
        returns(({x, testId}) => <div data-testid={testId}>{x + 1}</div>),
      ),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'branch'
    const {rerender} = render(<Comp x={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('4')
    rerender(<Comp x={1} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
  })

  test('works at top level', () => {
    const Comp: FC<{
      x: number
      testId: string
    }> = flowMax(
      returns(({x, testId}) => <div data-testid={testId}>{x + 1}</div>),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'top-level'
    render(<Comp x={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('4')
  })
})
