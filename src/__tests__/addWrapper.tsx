import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addWrapper, flowMax} from '..'
import {AddWrapperRenderCallback} from '../addWrapper'

const Wrapper: FC<{
  x: string
}> = ({x, children}) => (
  <div data-testid="wrapper">
    <span data-testid="passed-x">{x}</span>
    {children}
  </div>
)

const Comp: FC<{
  x: string
  y: string
}> = flowMax(
  addWrapper((_render: AddWrapperRenderCallback<{z: number}>, {x}) => (
    <Wrapper x={x}>
      {_render({
        z: 3,
      })}
    </Wrapper>
  )),
  ({y, z}) => (
    <div>
      <span data-testid="child-y">{y}</span>
      <span data-testid="child-z">{z}</span>
    </div>
  ),
)

describe('addWrapper', () => {
  test('works', () => {
    render(<Comp x="2" y="4" />)
    expect(screen.getByTestId('child-y')).toHaveTextContent('4')
    expect(screen.getByTestId('child-z')).toHaveTextContent('3')
    expect(screen.getByTestId('passed-x')).toHaveTextContent('2')
  })
})
