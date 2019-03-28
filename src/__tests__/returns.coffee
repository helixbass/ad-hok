import {flowMax, returns, branch} from '..'

describe 'returns', ->
  test 'works as initial step', ->
    ret = flowMax(returns(3), -> 4) 1

    expect(ret).toBe 3

  test 'works as non-initial step', ->
    ret = flowMax((-> 2), returns(3), -> 4) 1

    expect(ret).toBe 3

  test 'works with branch()', ->
    returnThreeIfGreaterThanOne = flowMax branch(((x) -> x > 1), returns 3), ->
      4

    ret = returnThreeIfGreaterThanOne 2
    expect(ret).toBe 3

    ret = returnThreeIfGreaterThanOne 1
    expect(ret).toBe 4
