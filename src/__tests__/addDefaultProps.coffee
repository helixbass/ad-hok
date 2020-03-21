### eslint-disable no-console ###
import 'jest-dom/extend-expect'

import addDefaultProps from '../addDefaultProps'

describe 'addDefaultProps', ->
  test 'adds prop from function when missing', ->
    expect(addDefaultProps(({a}) -> b: a + 1) a: 1).toEqual a: 1, b: 2

  test 'adds prop from obect when missing', ->
    expect(addDefaultProps(a: 1) {}).toEqual a: 1

  test 'adds prop from object when null', ->
    expect(addDefaultProps(a: 1) a: null).toEqual a: 1

  test 'adds prop from object when undefined', ->
    expect(addDefaultProps(a: 1) a: undefined).toEqual a: 1

  test 'does not add props from object when present', ->
    expect(addDefaultProps(a: 1) a: 'present').toEqual a: 'present'

  test 'does not add props from object when falsy', ->
    expect(addDefaultProps(a: 1) a: false).toEqual a: false
