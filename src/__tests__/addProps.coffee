import addProps from '../addProps'

describe 'addProps', ->
  test 'adds object', ->
    expect(addProps(b: 2)(a: 1, b: 3)).toEqual(a: 1, b: 2)

  test 'adds function', ->
    expect(addProps(({b}) -> b: b + 1)(a: 1, b: 2)).toEqual(a: 1, b: 3)
