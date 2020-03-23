### eslint-disable no-console ###
import React from 'react'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'
import {render} from 'react-testing-library'

import addDefaultProps from '../addDefaultProps'

Greeting = flow(
  addDefaultProps ({num}) -> name: if num > 1 then 'People' else 'Person'
  ({name}) -> <span>Hello, {name}</span>
)

Greeting2 = flow(
  addDefaultProps name: 'World'
  ({name}) -> <span>Hello, {name}</span>
)

describe 'addDefaultProps', ->
  test 'adds prop from function when missing', ->
    {getByText} = render <Greeting num={2} />
    getByText /Hello,.+People/
    undefined

  test 'adds prop from object when missing', ->
    {getByText} = render <Greeting2 />
    getByText /Hello,.+World/
    undefined

  test 'adds prop from object when null', ->
    {getByText} = render <Greeting2 name={null} />
    getByText /Hello,.+World/
    undefined

  test 'adds prop from object when undefined', ->
    {getByText} = render <Greeting2 name={undefined} />
    getByText /Hello,.+World/
    undefined

  test 'does not add props from object when present', ->
    {getByText} = render <Greeting2 name={'Buddy'} />
    getByText /Hello,.+Buddy/
    undefined
