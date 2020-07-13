/* eslint-disable no-console */
import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addProps, flowMax} from '..'

describe('addProps', () => {
  test('adds object', () => {
    const Comp: FC<{
      a: number
      b: number
      testId: string
    }> = flowMax(
      addProps({
        b: 2,
      }),
      ({a, b, testId}) => (
        <div data-testid={testId}>
          {a}
          {b}
        </div>
      ),
    )
    const testId = 'add-object'
    render(<Comp a={1} b={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('12')
  })

  test('adds function', () => {
    const Comp: FC<{
      a: number
      b: number
      testId: string
    }> = flowMax(
      addProps(({b}) => ({
        b: b + 1,
      })),
      ({a, b, testId}) => (
        <div data-testid={testId}>
          {a}
          {b}
        </div>
      ),
    )
    const testId = 'add-function'
    render(<Comp a={1} b={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('14')
  })

  test('works with dependencies list', () => {
    const Comp: FC<{
      x: number
      z: number
      user?: {
        id: number
      }
      testId: string
    }> = flowMax(
      addProps(
        ({x}) => {
          console.log('recomputing y')
          return {
            y: x * 2,
          }
        },
        ['x', 'user.id'],
      ),
      ({y, testId}) => <div data-testid={testId}>{y}</div>,
    )

    jest.spyOn(console, 'log').mockImplementation(() => {})

    const testId = 'basic'
    const {rerender} = render(
      <Comp x={2} z={3} testId={testId} user={{id: 3}} />,
    )
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('4')

    rerender(<Comp x={2} z={5} testId={testId} user={{id: 3}} />)
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()

    rerender(<Comp x={4} z={5} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('8')

    rerender(<Comp x={4} z={5} testId={testId} user={{id: 4}} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
  })

  test('works with dependencies callback', () => {
    const Comp: FC<{
      x: number
      z: number
      testId: string
    }> = flowMax(
      addProps(
        ({x}) => {
          console.log('recomputing y')
          return {
            y: x * 2,
          }
        },
        (prevProps, props) => props.x > prevProps.x,
      ),
      ({y, testId}) => <div data-testid={testId}>{y}</div>,
    )

    jest.spyOn(console, 'log').mockImplementation(() => {})

    const testId = 'dependencies-callback'
    const {rerender} = render(<Comp x={2} z={3} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('4')

    rerender(<Comp x={1} z={5} testId={testId} />)
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()

    rerender(<Comp x={4} z={5} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('8')
  })
})
