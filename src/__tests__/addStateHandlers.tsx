/* eslint-disable no-console, react/prop-types */
import React, {FC} from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addStateHandlers, flowMax} from '..'

const Comp: FC<{
  testId: string
}> = flowMax(
  addStateHandlers(
    {
      x: 2,
    },
    {
      incrementX: ({x}) => ({by: amount = 1} = {}) => ({
        x: x + amount,
      }),
    },
  ),
  ({x, incrementX, testId}) => (
    <div>
      <div data-testid={testId}>{x}</div>
      <button onClick={incrementX}>increment</button>
      <button onClick={() => incrementX({by: 2})}>two</button>
    </div>
  ),
)

describe('addStateHandlers', () => {
  test('initial state', () => {
    const testId = 'initial-state'
    render(<Comp testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('2')
  })

  test('handler', () => {
    const testId = 'handler'
    render(<Comp testId={testId} />)
    fireEvent.click(screen.getByText(/increment/))
    expect(screen.getByTestId(testId)).toHaveTextContent('3')

    fireEvent.click(screen.getByText(/two/))
    expect(screen.getByTestId(testId)).toHaveTextContent('5')
  })

  test('handler passes props', () => {
    const Comp2: FC<{
      y: number
      testId: string
    }> = flowMax(
      addStateHandlers(
        {
          x: 12,
        },
        {
          incrementX: ({x}, {y = 0}) => ({by: amount = 1} = {}) => ({
            x: x + amount + y,
          }),
        },
      ),
      ({x, incrementX, testId}) => (
        <div>
          <div data-testid={testId}>{x}</div>
          <button onClick={incrementX}>incremental</button>
          <button onClick={() => incrementX({by: 2})}>two more</button>
        </div>
      ),
    )

    const testId = 'passes-props'
    render(<Comp2 y={1} testId={testId} />)
    fireEvent.click(screen.getByText(/incremental/))
    expect(screen.getByTestId(testId)).toHaveTextContent('14')

    fireEvent.click(screen.getByText(/two more/))
    expect(screen.getByTestId(testId)).toHaveTextContent('17')
  })

  test('initial state based on props', () => {
    const Comp3: FC<{
      initialX: number
      testId: string
    }> = flowMax(
      addStateHandlers(
        ({initialX}) => ({
          x: initialX,
        }),
        {
          incrementX: ({x}) => ({by: amount = 1} = {}) => ({
            x: x + amount,
          }),
        },
      ),
      ({x, incrementX, testId}) => (
        <div>
          <div data-testid={testId}>{x}</div>
          <button onClick={incrementX}>increment</button>
          <button onClick={() => incrementX({by: 2})}>two</button>
        </div>
      ),
    )

    const testId = 'initial-state-from-props'
    render(<Comp3 initialX={9} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('9')
  })

  test("doesn't change handler identities", () => {
    const EmptyPure: FC<{
      onClick: () => void
      label?: string
    }> = React.memo(({onClick, label = 'empty pure button'}) => {
      console.log('Pure rerendered')
      return (
        <div>
          <button onClick={onClick}>{label}</button>
        </div>
      )
    })

    const ContainsPure: FC<{
      y: number
      testId: string
    }> = flowMax(
      addStateHandlers(
        {
          x: 1,
        },
        {
          incrementX: ({x}, {y}) => () => ({
            x: x + y,
          }),
        },
      ),
      ({incrementX, x, testId}) => (
        <div>
          <EmptyPure onClick={incrementX} />
          <div data-testid={testId}>{x}</div>
        </div>
      ),
    )

    jest.spyOn(console, 'log').mockImplementation(() => {})

    const testId = 'empty-deps'
    const {rerender} = render(<ContainsPure y={2} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('1')

    rerender(<ContainsPure y={3} testId={testId} />)
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()

    fireEvent.click(screen.getByText(/empty pure button/))
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('4')

    fireEvent.click(screen.getByText(/empty pure button/))
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('7')
  })

  test('initial state only gets computed once', () => {
    const getInitial = jest.fn(() => ({
      x: 1,
    }))
    const Component: FC<{
      testId: string
    }> = flowMax(
      addStateHandlers(() => getInitial(), {
        incrementX: ({x}) => ({by: amount = 1} = {}) => ({
          x: x + amount,
        }),
      }),
      ({x, incrementX, testId}) => (
        <div>
          <div data-testid={testId}>{x}</div>
          <button onClick={incrementX}>increment</button>
          <button onClick={() => incrementX({by: 2})}>two</button>
        </div>
      ),
    )
    const testId = 'initial-state-computed-once'
    const {rerender} = render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
    rerender(<Component testId={testId} />)
    expect(getInitial).toHaveBeenCalledTimes(1)
  })

  test('handles multiple updates on same render', () => {
    const Component: FC<{
      testId: string
    }> = flowMax(
      addStateHandlers(
        {
          x: 1,
        },
        {
          incrementX: ({x}) => () => ({
            x: x + 1,
          }),
        },
      ),
      ({x, incrementX, testId}) => (
        <div>
          <div data-testid={testId}>{x}</div>
          <button
            onClick={() => {
              incrementX()
              incrementX()
            }}
          >
            trigger multiple updates
          </button>
        </div>
      ),
    )
    const testId = 'multiple-updates-on-same-render'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')

    fireEvent.click(screen.getByText(/trigger multiple updates/))
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
  })
  test("doesn't care if new state keys get added by handlers", () => {
    const Component: FC<{
      testId: string
    }> = flowMax(
      addStateHandlers(
        {
          x: 1,
        } as {
          x: number
          hasIncremented?: boolean
        },
        {
          incrementX: ({x}) => () => ({
            x: x + 1,
            hasIncremented: true,
          }),
        },
      ),
      ({x, incrementX, testId, hasIncremented}) => (
        <div>
          <div data-testid={testId}>{x}</div>
          <div data-testid={'#{testId}-hasIncremented'}>
            {hasIncremented != null ? 'yes' : 'no'}
          </div>
          <button onClick={incrementX}>increment and mark incremented</button>
        </div>
      ),
    )
    const testId = 'new-state-keys-added'
    const testIdHasIncremented = '#{testId}-hasIncremented'
    render(<Component testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
    expect(screen.getByTestId(testIdHasIncremented)).toHaveTextContent('no')

    fireEvent.click(screen.getByText(/increment and mark incremented/))
    expect(screen.getByTestId(testId)).toHaveTextContent('2')
    expect(screen.getByTestId(testIdHasIncremented)).toHaveTextContent('yes')
  })
})
