/* eslint-disable no-console, react/prop-types */
import React, {FC, useRef} from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addHandlers, addState, flowMax} from '..'

const Comp: FC<{
  onClick: (value: string) => void
}> = flowMax(
  addHandlers({
    onClick: ({onClick}) => (num: number) => {
      onClick(`${num * 2}`)
    },
  }),
  ({onClick}) => (
    <div>
      <button onClick={() => onClick(3)}>update</button>
    </div>
  ),
)

const Outer: FC<{
  testId: string
}> = ({testId}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  return (
    <div>
      <input data-testid={testId} ref={inputRef} />
      <Comp onClick={(val: string) => (inputRef.current!.value = val)} />
    </div>
  )
}

const Deps: FC<{
  x: number
  user: {
    id: number
  }
  testId: string
}> = flowMax(
  addState('y', 'setY', 2),
  addHandlers(
    {
      onClick: ({x, setY}) => () => {
        setY(x + 1)
      },
    },
    ['x', 'setY', 'user.id'],
  ),
  ({onClick, y, testId}) => (
    <div>
      <Pure onClick={onClick} />
      <div data-testid={testId}>{y}</div>
    </div>
  ),
)

const DepsCallback: FC<{
  x: number
  testId: string
}> = flowMax(
  addState('y', 'setY', 2),
  addHandlers(
    {
      onClick: ({x, setY}) => () => {
        setY(x + 1)
      },
    },
    (prevProps, props) => prevProps.x < props.x,
  ),
  ({onClick, y, testId}) => (
    <div>
      <Pure onClick={onClick} label="pure button DepsCallback" />
      <div data-testid={testId}>{y}</div>
    </div>
  ),
)

const Pure: FC<{
  onClick: () => void
  label?: string
}> = React.memo(({onClick, label = 'pure button'}) => {
  console.log('Pure rerendered')
  return (
    <div>
      <button onClick={onClick}>{label}</button>
    </div>
  )
})

describe('addHandlers', () => {
  test('works', () => {
    const testId = 'works'
    render(<Outer testId={testId} />)

    fireEvent.click(screen.getByText(/update/))
    expect((screen.getByTestId(testId) as HTMLInputElement).value).toBe('6')
  })

  test('allows specifying dependencies for stable handler identities across rerenders', () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})

    const testId = 'y'
    let x = 4
    const {rerender} = render(<Deps x={x} testId={testId} user={{id: 3}} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()

    rerender(<Deps x={x} testId={testId} user={{id: 3}} />)
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()

    fireEvent.click(screen.getByText(/pure button/))
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('5')

    x = 6
    rerender(<Deps x={x} testId={testId} user={{id: 3}} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()

    fireEvent.click(screen.getByText(/pure button/))
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('7')

    rerender(<Deps x={x} testId={testId} user={{id: 4}} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('7')
  })

  test('allows specifying dependencies as callback', () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})

    const testId = 'dependencies-callback'
    let x = 5
    const {rerender} = render(<DepsCallback x={x} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()

    rerender(<DepsCallback x={x} testId={testId} />)
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()

    x = 4
    rerender(<DepsCallback x={x} testId={testId} />)
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()

    fireEvent.click(screen.getByText(/pure button DepsCallback/))
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('6')

    x = 6
    rerender(<DepsCallback x={x} testId={testId} />)
    expect(console.log).toHaveBeenCalledTimes(1)
    ;(console.log as any).mockClear()

    fireEvent.click(screen.getByText(/pure button DepsCallback/))
    expect(console.log).not.toHaveBeenCalled()
    ;(console.log as any).mockClear()
    expect(screen.getByTestId(testId)).toHaveTextContent('7')
  })
})
