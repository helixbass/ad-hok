import React, {FC} from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addRef, addProps, flowMax} from '..'

describe('addRef', () => {
  describe('with no initial value', () => {
    test('works', () => {
      const Comp: FC<{
        testId: string
      }> = flowMax(
        addRef<'inputRef', HTMLInputElement | null, {testId: string}>(
          'inputRef',
        ),
        ({inputRef, testId}) => (
          <div>
            <input data-testid={testId} ref={inputRef} />
            <button
              onClick={() => {
                inputRef.current?.focus()
              }}
            >
              update
            </button>
          </div>
        ),
      )

      const testId = 'input'
      render(<Comp testId={testId} />)
      fireEvent.click(screen.getByText(/update/))
      expect(document.activeElement).toBe(screen.getByTestId(testId))
    })
  })
  describe('with initial value', () => {
    test('works', () => {
      const Comp: FC = flowMax(addRef('inputRef', 'initial'), ({inputRef}) => (
        <p>{inputRef.current}</p>
      ))

      render(<Comp />)
      screen.getByText('initial')
    })
  })
  describe('with initial value from props', () => {
    test('works', () => {
      const Comp: FC = flowMax(
        addProps({
          value: 'initial',
        }),
        addRef('inputRef', ({value}) => value),
        ({inputRef}) => <p>{inputRef.current}</p>,
      )

      render(<Comp />)
      screen.getByText('initial')
    })
  })
  test('initial state only gets computed once', () => {
    const getInitial = jest.fn(() => 1)
    const Component: FC<{
      testId: string
    }> = flowMax(addRef('x', getInitial), ({x, testId}) => (
      <div data-testid={testId}>{x.current}</div>
    ))
    const testId = 'initial-state-computed-once'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
    rerender(<Component testId={testId} />)
    expect(getInitial).toHaveBeenCalledTimes(1)
  })
})
