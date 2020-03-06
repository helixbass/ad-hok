import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import {addProps, addRef} from '..'

Comp = flow(
  addRef 'inputRef'
  ({inputRef}) ->
    <div>
      <input data-testid="input" ref={inputRef} />
      <button onClick={-> inputRef.current.focus()}>update</button>
    </div>
)

CompWithInitialValue = flow(
  addRef 'inputRef', 'initial'
  ({inputRef}) ->
    <p>{inputRef.current}</p>
)

CompWithInitialValueFromProps = flow(
  addProps value: 'initial'
  addRef 'inputRef', ({value}) -> value
  ({inputRef}) ->
    <p>{inputRef.current}</p>
)

describe 'addRef', ->
  describe 'with no initial value', ->
    test 'works', ->
      {getByText, getByTestId} = render <Comp />
      fireEvent.click getByText /update/
      expect(document.activeElement).toBe getByTestId 'input'
  describe 'with initial value', ->
    test 'works', ->
      {getByText} = render <CompWithInitialValue />
      getByText 'initial'
      undefined
  describe 'with initial value from props', ->
    test 'works', ->
      {getByText} = render <CompWithInitialValueFromProps />
      getByText 'initial'
      undefined
