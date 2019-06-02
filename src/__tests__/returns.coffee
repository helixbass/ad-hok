import {flowMax, returns, branchPure} from '..'

describe 'returns', ->
  test 'works as initial step', ->
    ret = flowMax(returns((val) -> val + 2), -> 4) 1

    expect(ret).toBe 3

  test 'works as non-initial step', ->
    ret = flowMax((-> 2), returns((val) -> val + 1), -> 4) 1

    expect(ret).toBe 3

  test 'works with branchPure()', ->
    returnThreeIfGreaterThanOne = flowMax(
      branchPure ((x) -> x > 1), returns (val) -> val + 1
      ->
        4
    )

    ret = returnThreeIfGreaterThanOne 2
    expect(ret).toBe 3

    ret = returnThreeIfGreaterThanOne 1
    expect(ret).toBe 4
