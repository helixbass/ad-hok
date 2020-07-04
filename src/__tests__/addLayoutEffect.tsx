import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addState, addLayoutEffect, flowMax, addRef} from '..'

describe('addLayoutEffect', () => {
  test('fires', async () => {
    const Comp: FC<{
      testId: string
    }> = flowMax(
      addRef('x', 0),
      addLayoutEffect(({x}) => () => {
        x.current = x.current + 1
      }),
      ({x, testId}) => <div data-testid={testId}>{x.current}</div>,
    )

    const testId = 'addLayoutEffect-fires'
    const {rerender} = render(<Comp testId={testId} />)
    rerender(<Comp testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
    rerender(<Comp testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('2')
  })

  test('passes dependencies arg to useEffect()', () => {
    const Comp: FC<{
      testId: string
    }> = flowMax(
      addState('x', 'setX', 0),
      addLayoutEffect(
        ({x, setX}) => () => {
          setX(x + 1)
        },
        [],
      ),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'addLayoutEffect-passes-dependencies'
    const {rerender} = render(<Comp testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
    rerender(<Comp testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
  })

  test('accepts simple dependencies', () => {
    const Comp: FC<{
      y: number
      z: number
      testId: string
    }> = flowMax(
      addState('x', 'setX', 0),
      addLayoutEffect(
        ({x, setX}) => () => {
          setX(x + 1)
        },
        ['y'],
      ),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'simple-dependencies'
    const {rerender} = render(<Comp y={1} z={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')

    rerender(<Comp y={1} z={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')

    rerender(<Comp y={2} z={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('2')
  })

  test('accepts path dependencies', () => {
    const PathDependency: FC<{
      y: number
      z: number
      user: {
        id: number
      }
      testId: string
    }> = flowMax(
      addState('x', 'setX', 0),
      addLayoutEffect(
        ({x, setX}) => () => {
          setX(x + 1)
        },
        ['y', 'user.id'],
      ),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'path-dependency'
    const {rerender} = render(
      <PathDependency y={1} z={2} testId={testId} user={{id: 3}} />,
    )
    expect(screen.getByTestId(testId)).toHaveTextContent('1')

    rerender(<PathDependency y={1} z={3} testId={testId} user={{id: 3}} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')

    rerender(<PathDependency y={2} z={3} testId={testId} user={{id: 3}} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('2')

    rerender(<PathDependency y={2} z={3} testId={testId} user={{id: 4}} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
  })

  test('accepts callback dependencies argument', () => {
    const Comp: FC<{
      y: number
      z: number
      testId: string
    }> = flowMax(
      addState('x', 'setX', 0),
      addLayoutEffect(
        ({x, setX}) => () => {
          setX(x + 1)
        },
        (prevProps, props) => prevProps.y < props.y,
      ),
      ({x, testId}) => <div data-testid={testId}>{x}</div>,
    )

    const testId = 'callback-dependencies'
    const {rerender} = render(<Comp y={1} z={2} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')

    rerender(<Comp y={1} z={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')

    rerender(<Comp y={0} z={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')

    rerender(<Comp y={2} z={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('2')
  })
})
