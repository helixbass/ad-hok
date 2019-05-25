import React, {createFactory} from 'react'
import {render, waitForElement} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import {addState, addEffect} from '..'

# eslint-disable-next-line coffee/prop-types
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
      setX 'ddd'
  createFactory DisplayComp
)

Comp2 = flow(
  addState 'x', 'setX', 0
  addEffect(
    ({x, setX}) ->
      ->
        setX x + 1
    []
  )
  createFactory DisplayComp
)

describe 'addEffect', ->
  test 'fires', ->
    {getByText, rerender} = render <Comp />
    rerender <Comp />
    updatedEl = await waitForElement -> getByText 'ddd'
    expect(updatedEl).toHaveTextContent 'ddd'

  test 'passes changed-props arg to useEffect()', ->
    {queryByText, getByText, rerender} = render <Comp2 />
    getByText '1'
    rerender <Comp2 />
    getByText '1'
    expect(queryByText '2').toBeNull()
