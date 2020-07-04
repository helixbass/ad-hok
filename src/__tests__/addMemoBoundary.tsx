/* eslint-disable no-console */
import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addMemoBoundary, addProps, flowMax} from '..'

describe('addMemoBoundary', () => {
  test('with no comparison function or array of dependencies', () => {
    const Comp: FC<{
      a: number
      x: number
      testId: string
    }> = flowMax(
      addMemoBoundary(),
      addProps(({x}) => {
        console.log('recomputing y')
        return {
          y: x * 2,
        }
      }),
      ({y, testId}) => <div data-testid={testId}>{y}</div>,
    )

    jest.spyOn(console, 'log').mockImplementation(() => {})

    const testId = 'nothing'
    const {rerender} = render(<Comp a={1} x={2} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('4')

    rerender(<Comp a={1} x={2} testId={testId} />)
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()

    rerender(<Comp a={2} x={3} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('6')
  })

  describe('with an array of dependencies', () => {
    test('no path dependencies', () => {
      const Comp: FC<{
        a: number
        x: number
        testId: string
      }> = flowMax(
        addMemoBoundary(['x']),
        addProps(({x}) => {
          console.log('recomputing y')
          return {
            y: x * 2,
          }
        }),
        ({y, testId}) => <div data-testid={testId}>{y}</div>,
      )

      jest.spyOn(console, 'log').mockImplementation(() => {})

      const testId = 'no-path-dependencies'
      const {rerender} = render(<Comp a={1} x={2} testId={testId} />)
      expect(console.log).toHaveBeenCalledTimes(1)
      ;(console.log as any).mockClear()
      expect(screen.getByTestId(testId)).toHaveTextContent('4')

      rerender(<Comp a={2} x={2} testId={testId} />)
      expect(console.log).not.toHaveBeenCalled()
      ;(console.log as any).mockClear()

      rerender(<Comp a={2} x={3} testId={testId} />)
      expect(console.log).toHaveBeenCalledTimes(1)
      ;(console.log as any).mockClear()
      expect(screen.getByTestId(testId)).toHaveTextContent('6')
    })

    test('path dependencies', () => {
      const Comp: FC<{
        object: {
          a: number
          x: number
        }
        testId: string
      }> = flowMax(
        addMemoBoundary(['object.x']),
        addProps(({object: {x}}) => {
          console.log('recomputing y')
          return {
            y: x * 2,
          }
        }),
        ({y, testId}) => <div data-testid={testId}>{y}</div>,
      )

      jest.spyOn(console, 'log').mockImplementation(() => {})

      const testId = 'path-dependencies'
      const {rerender} = render(<Comp object={{a: 1, x: 2}} testId={testId} />)
      expect(console.log).toHaveBeenCalledTimes(1)
      ;(console.log as any).mockClear()
      expect(screen.getByTestId(testId)).toHaveTextContent('4')

      rerender(<Comp object={{a: 2, x: 2}} testId={testId} />)
      expect(console.log).not.toHaveBeenCalled()
      ;(console.log as any).mockClear()

      rerender(<Comp object={{a: 2, x: 3}} testId={testId} />)
      expect(console.log).toHaveBeenCalledTimes(1)
      ;(console.log as any).mockClear()
      expect(screen.getByTestId(testId)).toHaveTextContent('6')
    })
  })

  test('with a comparison function', () => {
    const Comp4: FC<{
      x: number
      testId: string
    }> = flowMax(
      addMemoBoundary((oldProps, newProps) => newProps.x !== 3),
      addProps(({x}) => {
        console.log('recomputing y')
        return {
          y: x * 2,
        }
      }),
      ({y, testId}) => <div data-testid={testId}>{y}</div>,
    )

    jest.spyOn(console, 'log').mockImplementation(() => {})

    const testId = 'function'
    const {rerender} = render(<Comp4 x={1} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('2')

    rerender(<Comp4 x={2} testId={testId} />)
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()

    rerender(<Comp4 x={3} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('6')
  })
})
