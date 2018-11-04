import React, {createFactory} from 'react'
import {render, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import addState from '../addState'
import addEffect from '../addEffect'

DisplayComp = ({x}) ->
  <div>
    <div data-testid="a">{x}</div>
  </div>

Comp = flow(
  addState 'x', 'setX', 'aaa'
  addEffect ({setX}) ->
    ->
      # axios.get.mockResolvedValueOnce data: greeting: 'ddd'
      # {data: {greeting}} = await axios.get 'SOME_URL'
      greeting = 'ddd'
      setX greeting
  createFactory DisplayComp
)

describe 'addEffect', ->
  test 'fires', ->
    {getByText, rerender} = render <Comp />
    rerender <Comp />
    updatedEl = await waitForElement -> getByText 'ddd'
    expect(updatedEl).toHaveTextContent 'ddd'
