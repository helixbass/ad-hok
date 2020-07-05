import React, {FC} from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {branch, flowMax, renderNothing, addStateHandlers, addState} from '..'

const Comp: FC<{
  a: number
  testId: string
}> = flowMax(
  branch(
    ({a}) => a > 2,
    (props) => ({...props, b: 999}),
    (props) => ({...props, b: -888}),
  ),
  ({b, testId}) => <div data-testid={testId}>{b}</div>,
)

const Brancher: FC<{
  a: number
  testId: string
}> = flowMax(
  addStateHandlers(
    {
      abort: false,
    },
    {
      toggleAbort: ({abort}) => () => ({
        abort: !abort,
      }),
    },
  ),
  branch(({abort}) => abort, renderNothing()),
  addState('unused', 'setUnused', null),
  ({a, testId, toggleAbort}) => (
    <div>
      <div data-testid={testId}>{a}</div>
      <button onClick={toggleAbort}>toggle abort</button>
    </div>
  ),
)

const Brancher2: FC<{
  abort: boolean
  a: number
  testId: string
}> = flowMax(
  branch(({abort}) => abort, renderNothing()),
  addState('unused', 'setUnused', null),
  ({a, testId}) => <div data-testid={testId}>{a}</div>,
)

describe('branch', () => {
  test('works when test passes', () => {
    const testId = 'pass'
    render(<Comp a={3} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('999')
  })

  test('works when test fails', () => {
    const testId = 'fail'
    render(<Comp a={1} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('-888')
  })

  test('works with renderNothing()', () => {
    const testId = 'renderNothing-branch'
    render(<Brancher a={1} testId={testId} />)
    expect(screen.getByTestId(testId)).toHaveTextContent('1')
    fireEvent.click(screen.getByText(/toggle abort/))
    expect(screen.queryByTestId(testId)).toBeNull()
  })

  test('works with renderNothing() when initially rendering nothing', () => {
    const testId = 'renderNothing-branch-initial-abort'
    const OuterState: FC = flowMax(
      addStateHandlers(
        {
          abort: true,
        },
        {
          toggleAbort: ({abort}) => () => ({
            abort: !abort,
          }),
        },
      ),
      ({abort, toggleAbort}) => (
        <div>
          <Brancher2 abort={abort} a={2} testId={testId} />
          <button onClick={toggleAbort}>toggle abort</button>
        </div>
      ),
    )
    render(<OuterState />)
    expect(screen.queryByTestId(testId)).toBeNull()
    fireEvent.click(screen.getByText(/toggle abort/))
    expect(screen.getByTestId(testId)).toHaveTextContent('2')
  })
})
