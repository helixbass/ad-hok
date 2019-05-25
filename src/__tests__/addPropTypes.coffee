### eslint-disable no-console ###
import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'
import PropTypes from 'prop-types'

import {addPropTypes, addProps, flowMax} from '..'

Comp = flowMax addPropTypes(a: PropTypes.number.isRequired), ({a}) ->
  <div>
    <div data-testid="a">{a}</div>
  </div>

Comp2 = flowMax addProps(b: 3), addPropTypes(c: PropTypes.number.isRequired), ({
  c
}) ->
  <div>
    <div data-testid="c">{c}</div>
  </div>

describe 'addPropTypes', ->
  beforeAll ->
    jest
    .spyOn console, 'error'
    .mockImplementation ->

  afterAll ->
    console.error.mockRestore()

  afterEach ->
    console.error.mockClear()

  test 'non-initial works', ->
    render <Comp2 c={3} />
    expect(console.error).not.toHaveBeenCalled()

  test 'non-initial works with wrong prop types', ->
    render <Comp2 c />
    expect(console.error).toHaveBeenCalled()

  test 'works', ->
    render <Comp a={3} />
    expect(console.error).not.toHaveBeenCalled()

  test 'works with wrong prop types', ->
    render <Comp a />
    expect(console.error).toHaveBeenCalled()
