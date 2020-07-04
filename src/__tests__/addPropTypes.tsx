/* eslint-disable no-console */
import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import PropTypes from 'prop-types'

import {addPropTypes, addProps, flowMax} from '..'

const Comp: FC<{
  a: number
  testId: string
}> = flowMax(
  addPropTypes({
    a: PropTypes.number.isRequired,
  }),
  ({a, testId}) => <div data-testid={testId}>{a}</div>,
)

const Comp2: FC<{
  c: number
  testId: string
}> = flowMax(
  addProps({
    b: 3,
  }),
  addPropTypes({
    c: PropTypes.number.isRequired,
  }),
  ({c, testId}) => (
    <div>
      <div data-testid={testId}>{c}</div>
    </div>
  ),
)

describe('addPropTypes', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    ;(console.error as any).mockRestore()
  })

  afterEach(() => {
    ;(console.error as any).mockClear()
  })

  test('non-initial works', () => {
    const testId = 'non-initial'
    render(<Comp2 c={3} testId={testId} />)
    expect(console.error).not.toHaveBeenCalled()
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
  })

  test('non-initial works with wrong prop types', () => {
    const testId = 'non-initial-wrong-prop-types'
    render(<Comp2 c={('a' as unknown) as number} testId={testId} />)
    expect(console.error).toHaveBeenCalled()
    expect(screen.getByTestId(testId)).toHaveTextContent('a')
  })

  test('works', () => {
    const testId = 'initial'
    render(<Comp a={3} testId={testId} />)
    expect(console.error).not.toHaveBeenCalled()
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
  })

  test('works with wrong prop types', () => {
    const testId = 'wrong-prop-types'
    render(<Comp a={('a' as unknown) as number} testId={testId} />)
    expect(console.error).toHaveBeenCalled()
    expect(screen.getByTestId(testId)).toHaveTextContent('a')
  })
})
