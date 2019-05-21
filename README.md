# Ad-hok

Ad-hok is a set of helpers that let you use React [hooks](https://reactjs.org/docs/hooks-intro.html) in a [functional pipeline](https://www.martinfowler.com/articles/collection-pipeline/) style. Its API and concept are inspired by [Recompose](https://github.com/acdlite/recompose)

[**Full API documentation**](#api)

## Installation

```
$ npm install ad-hok
```

## Basic usage

```
import {flow} from 'lodash/fp'
import {addState, addHandlers} from 'ad-hok'

const Counter = flow(
  addState('count', 'setCount', 0),
  addHandlers({
    increment: ({ setCount }) => () => setCount(n => n + 1),
    decrement: ({ setCount }) => () =>  setCount(n => n - 1),
    reset: ({ setCount }) => () => setCount(0)
  }),
  ({count, increment, decrement, reset}) =>
    <>
      Count: {count}
      <button onClick={reset}>Reset</button>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
)
```

Ad-hok helpers can be composed using a simple function composition utility like [`lodash/fp`](https://github.com/lodash/lodash/wiki/FP-Guide)'s [`flow()`](https://simonsmith.io/dipping-a-toe-into-functional-js-with-lodash-fp/)

Compare this to using Recompose's [`compose()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#compose) to compose a chain of higher-order components:
```js
import {compose, withState, withHandlers} from 'recompose'

const addCounting = compose(
  withState('count', 'setCount', 0),
  withHandlers({
    increment: ({ setCount }) => () => setCount(n => n + 1),
    decrement: ({ setCount }) => () =>  setCount(n => n - 1),
    reset: ({ setCount }) => () => setCount(0)
  })
)

const EnhancedComponent = addCounting(SomeComponent)
```

## API

* [addState()](#addstate)
* [addEffect()](#addeffect)
* [addProps()](#addprops)
* [addHandlers()](#addhandlers)
* [addStateHandlers()](#addstatehandlers)
* [addRef()](#addref)
* [addContext()](#addcontext)

### `addState()`

```js
addState(
  stateName: string,
  stateUpdaterName: string,
  initialState: any | (props: Object) => any
): Function
```

Adds two additional props: a state value, and a function to update that state value

Wraps [`useState()`](https://reactjs.org/docs/hooks-reference.html#usestate) hook

Comparable to Recompose's [`withState()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withstate)

For example:

```js
const Counter = flow(
  addState('count', 'setCount', 0),
  ({count, setCount}) =>
    <>
      Count: {count}
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
)
```

### `addEffect()`

```js
addEffect(
  callback: (props: Object) => Function,
  dependencies: Array<any>
): Function
```

Accepts a function of props that returns a function (which gets passed to [`useEffect()`](https://reactjs.org/docs/hooks-reference.html#useeffect)). Used for imperative, possibly effectful code

The optional second argument is an array of values that the effect depends on. It corresponds to the [second argument to `useEffect()`](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)

For example:

```js
const Example = flow(
  addState('count', 'setCount', 0),
  addEffect(({count}) => () => {
    document.title = `You clicked ${count} times`
  }),
  ({count, setCount}) =>
    <>
      Count: {count}
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
)
```

### `addProps()`

```js
addProps(
  createProps: (incomingProps: Object) => Object | Object,
): Function
```

Accepts a function that returns additional props based on the incoming props. Or accepts an object of additional props. The additional props get merged with the incoming props

Doesn't wrap any hooks, just a convenience helper comparable to Recompose's [`withProps()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withprops)

For example:

```js
const Doubler = flow(
  addProps(({num}) => ({num: num * 2})),
  ({num}) =>
    <div>Number: {num}</div>
)

const Outer = () =>
  <Doubler num={3}> // renders "Number: 6"
```

### `addHandlers()`

```js
addHandlers(
  handlerCreators: {
    [handlerName: string]: (props: Object) => Function
  }
): Function
```

Takes an object map of handler creators. These are higher-order functions that accept a set of props and return a function handler.

Doesn't wrap any hooks, just a convenience helper comparable to Recompose's [`withHandlers()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withhandlers)

For example:

```js
const ClickLogger = flow(
  addHandlers({
    onClick: ({onClick}) => (...args) => {
      console.log('click')
      onClick(...args)
    }
  }),
  ({onClick}) =>
    <button onClick={onClick}>click me</button>
)
```

### `addStateHandlers()`

```js
addStateHandlers(
  initialState: Object | (props: Object) => any
  stateUpdaters: {
    [key: string]: (state: Object, props: Object) => (...payload: any[]) => Object
  }
): Function
```

Adds additional props for state object properties and immutable updater functions in a form of `(...payload: any[]) => Object`

Wraps [`useState()`](https://reactjs.org/docs/hooks-reference.html#usestate) hook

Comparable to Recompose's [`withStateHandlers()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withstatehandlers)

For example:

```js
const Counter = flow(
  addStateHandlers(
    {count: 0},
    {
      increment: ({count}) => () => ({count: count + 1}),
      decrement: ({count}) => () => ({count: count - 1}),
      reset: () => () => ({count: 0}),
    }
  ),
  ({count, increment, decrement, reset}) =>
    <>
      Count: {count}
      <button onClick={reset}>Reset</button>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
)
```

### `addRef()`

```js
addRef(
  refName: string,
  initialValue: any
): Function
```

Adds an additional prop of the given name whose value is a ref initialized to the given initial value

Wraps [`useRef()`](https://reactjs.org/docs/hooks-reference.html#useref) hook

For example:

```js
const Example = flow(
  addRef('inputRef', null),
  ({inputRef}) =>
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>focus input</button>
    </>
)
```

### `addContext()`

```js
addContext(
  context: ReactContextObject,
  contextName: string,
): Function
```

Adds an additional prop of the given name whose value is the current value of the given React context object

Wraps [`useContext()`](https://reactjs.org/docs/hooks-reference.html#usecontext) hook

For example:

```js
const ColorContext = React.createContext()

const Example = flow(
  addContext(ColorContext, 'color'),
  ({color}) =>
    <span>
      The current color is {color}
    </span>
)

const Outer = () =>
  <ColorContext.Provider value="red">
    <Example />
  </ColorContext.Provider>
```

## Motivation

#### Background

Recompose's approach is an elegant, highly composable way of building up logic out of small "building blocks" (in its case, higher-order components). Once I saw how clearly it expressed the separation between different pieces of functionality and the dependencies between them, it made writing class components look like an unappealing structure where you just have a flat set of methods and have to work hard to trace the dependencies between them

#### Enter hooks

Now React hooks have entered the picture. And they're very interesting and the promise of only using function components is great!

But I find the typical usage of hooks to still be less readable (and composable) than Recompose's style. By starting your function component bodies with a bunch of hooks, you're introducing a lot of local variable state. Visually tracking the dependencies between local variables is hard, many consider it good practice to minimize the use of local variables

So you can have the best of both worlds by using Ad-hok:
- Use hooks without introducing local variable state
- Easily track dependencies between hooks when scanning code

#### Display components

Another thing you lose with typical hooks usage is the simple "display component" - your function component body becomes two sections, first a bunch of stuff related to hooks and then rendering. By using Ad-hok, you regain the separation of actual rendering from surrounding logic

#### Reuse

In the simplest usage (as in the initial example), the final step in your `flow()` is a rendering function. If you want that rendering function to be an actual "display" function component (for reuse and/or eg prop types validation), just use `React.createFactory()`:
```js
import {createFactory} from 'react'

const DisplayCounter = ({count, increment, decrement, reset}) =>
  <>
    Count: {count}
    <button onClick={reset}>Reset</button>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </>

const Counter = flow(
  addState('count', 'setCount', 0),
  addHandlers({
    increment: ({ setCount }) => () => setCount(n => n + 1),
    decrement: ({ setCount }) => () =>  setCount(n => n - 1),
    reset: ({ setCount }) => () => setCount(0)
  }),
  createFactory(DisplayCounter) // or equivalently:   props => <DisplayCounter {...props} />
)
```

If you want to be able to reuse chunks of Ad-hok "container" logic, just extract and name that part of the `flow()`:
```js
const addCounter = flow(
  addState('count', 'setCount', 0),
  addHandlers({
    increment: ({ setCount }) => () => setCount(n => n + 1),
    decrement: ({ setCount }) => () =>  setCount(n => n - 1),
    reset: ({ setCount }) => () => setCount(0)
  })
)

const Counter = flow(
  addCounter,
  ({count, increment, decrement, reset}) =>
    <>
      Count: {count}
      <button onClick={reset}>Reset</button>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
)
```

<!-- TODO: keep props separate by starting flow() with props => ({props}) -->

## Help / Contributions / Feedback

Please file an issue or submit a PR with any questions/suggestions

## License

MIT
