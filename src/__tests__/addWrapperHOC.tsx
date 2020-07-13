import React, {FC, ComponentType} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addWrapperHOC, flowMax} from '..'
import {PropAddingHOC} from '../addWrapperHOC'

const hoc = <
  TProps extends {
    x: string
  }
>(
  Component: ComponentType<
    TProps & {
      z: number
    }
  >,
) => (props: TProps) => (
  <div>
    <span data-testid="hoc-passed-x">{props.x}</span>
    <Component {...props} z={3} />
  </div>
)

const Comp: FC<{
  x: string
  y: string
}> = flowMax(
  addWrapperHOC(
    hoc as PropAddingHOC<{
      z: number
    }>,
  ),
  ({y, z}) => (
    <div>
      <span data-testid="child-y">{y}</span>
      <span data-testid="child-z">{z}</span>
    </div>
  ),
)

describe('addWrapperHOC', () => {
  test('works', () => {
    render(<Comp x="2" y="4" />)
    expect(screen.getByTestId('hoc-passed-x')).toHaveTextContent('2')
    expect(screen.getByTestId('child-y')).toHaveTextContent('4')
    expect(screen.getByTestId('child-z')).toHaveTextContent('3')
  })
})
