import React, {FC} from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addState, flowMax} from '..'

const Comp: FC<{
  testId: string
}> = flowMax(addState('x', 'setX', 'abcd'), ({x, setX, testId}) => (
  <div>
    <div data-testid={testId}>{x}</div>
    <button onClick={() => setX('efg')}>update</button>
  </div>
))

const Comp2: FC<{
  initial: string
  testId: string
}> = flowMax(
  addState('x', 'setX', ({initial}) => initial),
  ({x, testId}) => (
    <div>
      <div data-testid={testId}>{x}</div>
    </div>
  ),
)

describe('addState', () => {
  test('initial state', () => {
    const testId = 'initial-state'
    render(<Comp testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('abcd')
  })

  test('setter', () => {
    const testId = 'setter'
    render(<Comp testId={testId} />)
    fireEvent.click(screen.getByText(/update/))
    expect(screen.getByTestId(testId)).toHaveTextContent('efg')
  })

  test('initial state from props', () => {
    const testId = 'initial-state-from-props'
    render(<Comp2 initial="aaa" testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('aaa')
  })

  test('initial state only gets computed once', () => {
    const getInitial = jest.fn(() => 1)
    const Component: FC<{
      testId: string
    }> = flowMax(addState('x', 'setX', getInitial), ({x, testId}) => (
      <div data-testid={testId}>{x}</div>
    ))
    const testId = 'initial-state-computed-once'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
    rerender(<Component testId={testId} />)
    expect(getInitial).toHaveBeenCalledTimes(1)
  })
})
