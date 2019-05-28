import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'

import {addWrapperHOC, flowMax} from '..'

hoc = (Component) -> (props) ->
  <div>
    <span data-testid="hoc-passed-x">{props.x}</span>
    <Component {...props} z={3} />
  </div>

Comp = flowMax addWrapperHOC(hoc), ({y, z}) ->
  <div>
    <span data-testid="child-y">{y}</span>
    <span data-testid="child-z">{z}</span>
  </div>

describe 'addWrapperHOC', ->
  test 'works', ->
    {getByTestId} = render <Comp x="2" y="4" />
    expect(getByTestId 'hoc-passed-x').toHaveTextContent '2'
    expect(getByTestId 'child-y').toHaveTextContent '4'
    expect(getByTestId 'child-z').toHaveTextContent '3'
