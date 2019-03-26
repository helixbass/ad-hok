import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'

import branch from '../branch'
import flowMax from '../flowMax'
import renderNothing from '../renderNothing'

Comp = flowMax branch((({a}) -> a > 2), renderNothing), ({a, testId}) ->
  <div data-testid={testId}>{a}</div>

describe 'renderNothing', ->
  test 'works', ->
    testId = 'pass'
    {queryByTestId} = render <Comp a={3} testId={testId} />
    expect(queryByTestId testId).toBeNull()
