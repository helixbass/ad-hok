import React, {FC, Reducer} from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addReducer, flowMax} from '..'

const reducer: Reducer<
  {
    count: number
  },
  | {
      type: 'increment'
    }
  | {
      type: 'decrement'
    }
> = (state, action) => {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
      }
    case 'decrement':
      return {
        count: state.count - 1,
      }
    default: {
      throw new Error()
    }
  }
}

const Comp: FC<{
  testId: string
}> = flowMax(
  addReducer(reducer, {
    count: 0,
  }),
  ({dispatch, count, testId}) => (
    <div>
      <div data-testid={testId}>{count}</div>
      <button
        onClick={() =>
          dispatch({
            type: 'increment',
          })
        }
      >
        increment
      </button>
    </div>
  ),
)

describe('addReducer', () => {
  test('initial state', () => {
    const testId = 'initial-state'
    render(<Comp testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('0')
  })

  test('dispatch', () => {
    const testId = 'dispatch'
    render(<Comp testId={testId} />)
    fireEvent.click(screen.getByText(/increment/))
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
  })

  test('initial state from props', () => {
    const Component: FC<{
      count: number
      testId: string
    }> = flowMax(
      addReducer(reducer, ({count}) => ({count})),
      ({dispatch, count, testId}) => (
        <div>
          <div data-testid={testId}>{count}</div>
          <button
            onClick={() =>
              dispatch({
                type: 'increment',
              })
            }
          >
            increment
          </button>
        </div>
      ),
    )
    const testId = 'initial-state-from-props'
    render(<Component count={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
  })

  test('initial state only gets computed once', () => {
    const getInitial = jest.fn(() => 1)
    const Component: FC<{
      testId: string
    }> = flowMax(
      addReducer(reducer, () => ({count: getInitial()})),
      ({dispatch, count, testId}) => (
        <div>
          <div data-testid={testId}>{count}</div>
          <button
            onClick={() =>
              dispatch({
                type: 'increment',
              })
            }
          >
            increment
          </button>
        </div>
      ),
    )
    const testId = 'initial-state-computed-once'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
    rerender(<Component testId={testId} />)
    expect(getInitial).toHaveBeenCalledTimes(1)
  })
})
