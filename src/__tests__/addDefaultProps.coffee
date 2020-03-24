### eslint-disable no-console ###
import React from 'react'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'
import {render} from 'react-testing-library'

import addDefaultProps from '../addDefaultProps'

Greeting = flow(
  addDefaultProps ({num}) -> name: if num > 1 then 'People' else 'Person'
  ({name, testId}) -> <span data-testid={testId}>Hello, {name}</span>
)

Greeting2 = flow(
  addDefaultProps name: 'World'
  ({name, testId}) -> <span data-testid={testId}>Hello, {name}</span>
)

Bool = flow(
  addDefaultProps bool: true
  ({bool, testId}) ->
    <span data-testid={testId}>{bool.toString()}</span>
)

describe 'addDefaultProps', ->
  runTest = ({name, props, testId, expectedContent, Component = Greeting2}) ->
    test name, ->
      {getByTestId} = render <Component {...props} testId={testId} />
      expect(getByTestId testId).toHaveTextContent expectedContent
      undefined

  runTest
    name: 'add props from function when missing'
    props: num: 2
    testId: 'function-missing'
    expectedContent: /Hello,.+People/
    Component: Greeting

  runTest
    name: 'add props from object when missing'
    props: {}
    testId: 'object-missing'
    expectedContent: /Hello,.+World/

  runTest
    name: 'add props from object when null'
    props: name: null
    testId: 'object-null'
    expectedContent: /Hello,.+World/

  runTest
    name: 'add props from object when undefined'
    props: name: undefined
    testId: 'object-null'
    expectedContent: /Hello,.+World/

  runTest
    name: 'does not add props from object when present'
    props: name: 'Buddy'
    testId: 'object-present'
    expectedContent: /Hello,.+Buddy/

  runTest
    name: 'does not add props from object when present with falsy value'
    props: bool: false
    testId: 'object-falsy'
    expectedContent: /false/
    Component: Bool
