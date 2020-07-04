import React, {FC, createContext} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {flowMax, addContext} from '..'

describe('addContext', () => {
  test('works', () => {
    const NumberContext = createContext(1)
    interface Props {
      testId: string
    }
    const Comp: FC<Props> = flowMax(
      addContext(NumberContext, 'number'),
      ({number, testId}) => <div data-testid={testId}>{number}</div>,
    )

    const testId = 'addContext'
    render(
      <NumberContext.Provider value={3}>
        <Comp testId={testId} />
      </NumberContext.Provider>,
    )
    expect(screen.getByTestId(testId)).toHaveTextContent('3')
  })
})
