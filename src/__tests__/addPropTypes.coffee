### eslint-disable no-console ###
import React from 'react'
import {render} from 'react-testing-library'
import 'jest-dom/extend-expect'
import PropTypes from 'prop-types'

import addPropTypes from '../addPropTypes'
import flowMax from '../flowMax'

Comp = flowMax addPropTypes(a: PropTypes.number.isRequired), ({a}) ->
  <div>
    <div data-testid="a">{a}</div>
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

  test 'works', ->
    render <Comp a={3} />
    expect(console.error).not.toHaveBeenCalled()

  test 'works with wrong prop types', ->
    render <Comp a />
    expect(console.error).toHaveBeenCalled()
