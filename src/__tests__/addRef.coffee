import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import 'jest-dom/extend-expect'
import {flow} from 'lodash/fp'

import {addRef} from '..'

Comp = flow addRef('inputRef'), ({inputRef}) ->
  <div>
    <input data-testid="input" ref={inputRef} />
    <button onClick={-> inputRef.current.focus()}>update</button>
  </div>

describe 'addRef', ->
  test 'works', ->
    {getByText, getByTestId} = render <Comp />
    fireEvent.click getByText /update/
    expect(document.activeElement).toBe getByTestId 'input'
