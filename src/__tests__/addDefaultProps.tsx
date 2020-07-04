/* eslint-disable no-console */
import React, {FC} from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import {addDefaultProps, flowMax} from '..'

const Greeting: FC<{
  num: number
  testId: string
  name?: string
}> = flowMax(
  addDefaultProps(({num}) => ({
    name: num > 1 ? 'People' : 'Person',
  })),
  ({name, testId}) => <span data-testid={testId}>Hello, {name}</span>,
)

const Greeting2: FC<{
  name?: string | null
  testId: string
}> = flowMax(
  addDefaultProps({
    name: 'World',
  }),
  ({name, testId}) => <span data-testid={testId}>Hello, {name}</span>,
)

const Bool: FC<{
  bool?: boolean
  testId: string
}> = flowMax(
  addDefaultProps({
    bool: true,
  }),
  ({bool, testId}) => <span data-testid={testId}>{bool.toString()}</span>,
)

describe('addDefaultProps', () => {
  const runTest = <
    TComponentProps extends {
      testId: string
    }
  >({
    name,
    props,
    testId,
    expectedContent,
    Component,
  }: {
    name: string
    props: Omit<TComponentProps, 'testId'>
    testId: string
    expectedContent: RegExp
    Component: FC<TComponentProps>
  }) => {
    test(name, () => {
      render(<Component {...({...props, testId} as TComponentProps)} />)
      expect(screen.getByTestId(testId)).toHaveTextContent(expectedContent)
    })
  }

  runTest({
    name: 'add props from function when missing',
    props: {
      num: 2,
    },
    testId: 'function-missing',
    expectedContent: /Hello,.+People/,
    Component: Greeting,
  })

  runTest({
    name: 'add props from object when missing',
    props: {},
    testId: 'object-missing',
    expectedContent: /Hello,.+World/,
    Component: Greeting2,
  })

  runTest({
    name: 'add props from object when null',
    props: {
      name: null,
    },
    testId: 'object-null',
    expectedContent: /Hello,.+World/,
    Component: Greeting2,
  })

  runTest({
    name: 'add props from object when undefined',
    props: {
      name: undefined,
    },
    testId: 'object-undefined',
    expectedContent: /Hello,.+World/,
    Component: Greeting2,
  })

  runTest({
    name: 'does not add props from object when present',
    props: {
      name: 'Buddy',
    },
    testId: 'object-present',
    expectedContent: /Hello,.+Buddy/,
    Component: Greeting2,
  })

  runTest({
    name: 'does not add props from object when present with falsy value',
    props: {
      bool: false,
    },
    testId: 'object-falsy',
    expectedContent: /false/,
    Component: Bool,
  })
})
