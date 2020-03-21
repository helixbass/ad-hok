### eslint-disable no-console ###
import 'jest-dom/extend-expect'

import addDefaultProps from '../addDefaultProps'

describe 'addDefaultProps', ->
  test 'adds prop when missing', ->
    expect(addDefaultProps(a: 1) {}).toEqual a: 1

  test 'adds prop when null', ->
    expect(addDefaultProps(a: 1) a: null).toEqual a: 1

  test 'adds prop when undefined', ->
    expect(addDefaultProps(a: 1) a: undefined).toEqual a: 1

  test 'does not add props when present', ->
    expect(addDefaultProps(a: 1) a: 'present').toEqual a: 'present'

  test 'does not add props when falsy', ->
    expect(addDefaultProps(a: 1) a: false).toEqual a: false
