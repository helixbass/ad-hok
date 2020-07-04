/* eslint-disable no-console */
import React, {FC} from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addState, addWrapper, addProps, flowMax} from '..'
import {AddWrapperRenderCallback} from '../addWrapper'

const Comp: FC<{
  testId: string
}> = flowMax(addState('x', 'setX', 'abcd'), ({x, setX, testId}) => (
  <div>
    <div data-testid={testId}>{x}</div>
    <button onClick={() => setX('efg')}>update</button>
  </div>
))

type AddStuffType = <
  TProps extends {
    z: number
  }
>(
  props: TProps,
) => TProps & {
  y: number
  d: number
}

const addStuff: AddStuffType = flowMax(
  addWrapper((_render: AddWrapperRenderCallback<{y: number}>, {z}) => (
    <div>
      <div data-testid="passed-z">{z}</div>
      {_render({
        y: 2,
      })}
    </div>
  )),
  addProps({
    d: 4,
  }),
)

const Outer: FC<{
  z: number
  e: number
}> = flowMax(addStuff, ({y, d, e}) => (
  <div>
    <div data-testid="child-y">{y}</div>
    <div data-testid="child-d">{d}</div>
    <div data-testid="child-e">{e}</div>
  </div>
))

describe('flowMax', () => {
  test('works in place of flow()', () => {
    const testId = 'works'
    render(<Comp testId={testId} />)
    fireEvent.click(screen.getByText(/update/))
    expect(screen.getByTestId(testId)).toHaveTextContent('efg')
  })

  test('nesting with magic helpers', () => {
    render(<Outer z={3} e={5} />)
    expect(screen.getByTestId('passed-z')).toHaveTextContent('3')
    expect(screen.getByTestId('child-y')).toHaveTextContent('2')
    expect(screen.getByTestId('child-d')).toHaveTextContent('4')
    expect(screen.getByTestId('child-e')).toHaveTextContent('5')
  })

  test('throws nice error when passed a non-function', () => {
    expect(() => {
      flowMax({
        notA: 'function',
      } as any)
    }).toThrow('Expected a function')
  })

  test('throws nice error when passed undefined', () => {
    expect(() => {
      flowMax(undefined as any)
    }).toThrow('Expected a function')
  })
})
