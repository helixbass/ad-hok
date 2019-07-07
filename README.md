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

## Get "magic" with `flowMax()`

While `flow()` is great for composing most hooks-related functionality, there are some use cases (and corresponding Recompose
helpers) that it can't support. For example, anything where you'd want to "bail out early" rather than always progressing through the whole `flow()` and rendering the typical display component at the end of the `flow()`

So `ad-hok` provides a "magic" version of `flow()` called [`flowMax()`](#flowmax) that you use as your wrapper function when using any of the corresponding "magic" helpers:
- [`addPropTypes()`](#addproptypes)
- [`addWrapper()`](#addwrapper)
- [`branch()`](#branch)
- [`renderNothing()`](#rendernothing)
- [`returns()`](#returns)

##### `eslint-plugin-ad-hok`

If you use [ESLint](https://github.com/eslint/eslint), you can use [`eslint-plugin-ad-hok`](https://github.com/helixbass/eslint-plugin-ad-hok) to catch cases where:
- you forgot to use `flowMax()` when using a "magic" helper (`addPropTypes()`, `addWrapper()`, `branch()`, `renderNothing()` or `returns()`)
- you use `flowMax()` when a simple `flow()` would suffice

## API

* [addState()](#addstate)
* [addEffect()](#addeffect)
* [addProps()](#addprops)
* [addPropsOnChange()](#addpropsonchange)
* [addHandlers()](#addhandlers)
* [addStateHandlers()](#addstatehandlers)
* [addRef()](#addref)
* [addCallback()](#addcallback)
* [addContext()](#addcontext)
* [branch()](#branch)
* [branchPure()](#branchpure)
* [renderNothing()](#rendernothing)
* [returns()](#returns)
* [addPropTypes()](#addproptypes)
* [addWrapper()](#addwrapper)
* [flowMax()](#flowmax)

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
  dependencies?: Array<string>
): Function
```

Accepts a function of props that returns a function (which gets passed to [`useEffect()`](https://reactjs.org/docs/hooks-reference.html#useeffect)). Used for imperative, possibly effectful code

The optional second argument is an array of names of props that the effect depends on. It corresponds to the [second argument to `useEffect()`](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)

For example:

```js
const Example = flow(
  addState('count', 'setCount', 0),
  addEffect(({count}) => () => {
    document.title = `You clicked ${count} times`
  }, ['count']),
  addEffect(() => () => {
    console.log("I get called on every re-render")
  }),
  addEffect(() => () => {
    console.log("I only get called once on mount")
  }, []),
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
  dependencies?: Array<string>
): Function
```

Accepts a function that returns additional props based on the incoming props. Or accepts an object of additional props. The additional props get merged with the incoming props

The optional second argument is an array of names of props that the added props depend on. The added props will only get re-created when one of the dependency props changes. This can be used to avoid expensive recomputation or to stabilize prop identity across rerenders (allowing for downstream `shouldComponentUpdate()`/`React.memo()` optimizations that rely on prop equality)

Doesn't wrap any hooks (other than `useMemo()` for the dependency tracking), just a convenience helper comparable to Recompose's [`withProps()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withprops)

For example:

```js
const Doubler = flow(
  addProps(({num}) => ({num: num * 2})),
  ({num}) =>
    <div>Number: {num}</div>
)

const Outer = () =>
  <Doubler num={3}> // renders "Number: 6"
  
const OptimizedDoubler = flow(
  addProps(({num}) => ({num: num * 2}), ['num']),
  ({num}) =>
    <div>Number: {num}</div>
)
```

### `addPropsOnChange()`

```js
addPropsOnChange(
  dependenciesOrShouldMap: Array<string> | (props: Object, nextProps: Object) => boolean,
  createProps: (incomingProps: Object) => Object,
): Function
```

Like `addProps()`, except the new props are only created when one of the incoming props specified by `dependenciesOrShouldMap` changes. This can be used to avoid expensive recomputation or to stabilize prop identity across rerenders (allowing for downstream `shouldComponentUpdate()`/`React.memo()` optimizations that rely on prop equality)

When `dependenciesOrShouldMap` is specified as an array of prop dependencies, this is equivalent to calling `addProps()` with a dependencies argument (eg `addPropsOnChange(['x'], ...)` is equivalent to `addProps(..., ['x'])`)

Otherwise `dependenciesOrShouldMap` can be a function that returns a boolean, given the current props and the next props. This allows you to customize when `createProps()` should be called

Doesn't wrap any hooks (other than `useMemo()` for the dependency tracking), just a convenience helper comparable to Recompose's [`withPropsOnChange()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withpropsonchange)

For example:

```js
const Doubler = flow(
  addPropsOnChange(['num'], ({num}) => ({num: num * 2})),
  ({num}) =>
    <div>Number: {num}</div>
)

const DoublerNums = flow(
  addProps(
    (prevProps, props) => prevProps.nums[0] !== props.nums[0],
    ({nums}) => ({num: nums[0] * 2})
  ),
  ({num}) =>
    <div>Number: {num}</div>
)
```

### `addHandlers()`

```js
addHandlers(
  handlerCreators: {
    [handlerName: string]: (props: Object) => Function
  },
  dependencies?: Array<string>
): Function
```

Takes an object map of handler creators. These are higher-order functions that accept a set of props and return a function handler.

The optional second argument is an array of names of props that the handlers depend on. By providing this argument, the handlers' identities will stay stable across rerenders when the dependency props haven't changed (allowing for downstream `shouldComponentUpdate()`/`React.memo()` optimizations that rely on prop equality)

Doesn't wrap any hooks (other than `useMemo()` when passing the optional `dependencies` argument), just a convenience helper comparable to Recompose's [`withHandlers()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withhandlers)

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

const Fetcher = flow(
  addHandlers({
    onSubmit: ({someProp}) => () => {
      fetchData({someProp})
    },
  }, ['someProp']),
  ({onSubmit}) =>
    <ExpensiveToRender onSubmit={onSubmit} />
)
```

### `addStateHandlers()`

```js
addStateHandlers(
  initialState: Object | (props: Object) => any
  stateUpdaters: {
    [key: string]: (state: Object, props: Object) => (...payload: any[]) => Object
  },
  dependencies?: Array<string>
): Function
```

Adds additional props for state object properties and immutable updater functions in a form of `(...payload: any[]) => Object`

The optional third argument is an array of names of props that the handlers depend on. By providing this argument, the handlers' identities will stay stable across rerenders when neither the dependency props nor the state object has changed (allowing for downstream `shouldComponentUpdate()`/`React.memo()` optimizations that rely on prop equality)

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

const IncrementByX = flow(
  addStateHandlers(
    {count: 0},
    {
      increment: ({count}, {x}) => () => ({count: count + x}),
    },
    ['x']
  ),
  ({count, increment}) =>
    <>
      Count: {count}
      <ExpensiveToRender onClick={increment} />
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

### `addCallback()`

```js
addCallback(
  callbackName: string,
  callback: (props: Object) => Function,
  dependencies: Array<any>
): Function
```

Adds an additional prop of the given name whose value is a memoized callback. The second argument is a callback creator. This is a higher-order function that accept a set of props and return a callback. The optional third argument is an array of values that the callback depends on. It corresponds to the [second argument to `useCallback()`](https://reactjs.org/docs/hooks-reference.html#usecallback)

Wraps [`useCallback()`](https://reactjs.org/docs/hooks-reference.html#usecallback) hook

For example:

```js
const Example = flow(
  addState('inputNode', 'setInputNode'),
  addCallback('inputCallbackRef', ({setInputNode}) => node => {
    setInputNode(node)
  }),
  ({inputCallbackRef, inputNode}) =>
    <>
      <input ref={inputCallbackRef} />
      <button onClick={() => inputNode.focus()}>focus input</button>
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

### `branch()`

```js
branch(
  test: (props: Object) => boolean,
  left: (incomingProps: Object) => Object,
  right: ?(incomingProps: Object) => Object
): Function
```

A "magic" helper that accepts a test function and two functions. The test function is passed the incoming props. If it returns true, the left function is called with the incoming props; otherwise, the right function is called. If the right is not supplied, it will by default pass through the incoming props.

Doesn't wrap any hooks, just a convenience helper comparable to Recompose's [`branch()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#branch)

Since it's magic, you must wrap with [`flowMax()`](#flowmax) instead of `flow()`

Typically used along with the "magic" helpers [`renderNothing()`](#rendernothing)/[`returns()`](#returns)

For example:

```js
const Message = flowMax(
  branch(({hideMe}) => hideMe, renderNothing()),
  () =>
    <span>I'm not hidden!</span>
)

<Message hideMe /> // doesn't render anything
<Message /> // renders "I'm not hidden"
```

In order to avoid violating hooks invariants, both branches are rendered as separate components from the preceding steps of the `flowMax()`

If you don't want to have the branches rendered as components (eg when using `flowMax()` in a [non-React context](#bonususeadhokflowmaxoutsideofreact)), you can use [`branchPure()`](#branchpure) instead

### `branchPure()`

```js
branchPure(
  test: (props: Object) => boolean,
  left: (incomingProps: Object) => Object,
  right: ?(incomingProps: Object) => Object
): Function
```

A helper that (like [`branch()`](#branch)) accepts a test function and two functions. The test function is passed the incoming props. If it returns true, the left function is called with the incoming props; otherwise, the right function is called. If the right is not supplied, it will by default pass through the incoming props.

The difference from `branch()` is that the branches are not automatically rendered as React components. Typically, it's a good idea to use `branch()` when using `ad-hok` in a React setting (ie the typical usage where a `flowMax()` is a React component) in order to avoid violating hooks invariants. So your rule of thumb should be to only use `branchPure()` inside non-React-component `flowMax()`'s

For example:
```js
const returnsThreeSometimes = flowMax(
  branchPure(x => x > 1, returns(3)),
  x => x + 4
)

returnsThreeSometimes(2) // 3
returnsThreeSometimes(1) // 5
```

### `renderNothing()`

```js
renderNothing(): MagicReturnValue
```

A "magic" helper that always renders `null`

Since it's magic, you must wrap with [`flowMax()`](#flowmax) instead of `flow()`

Doesn't wrap any hooks, just a convenience helper comparable to Recompose's [`renderNothing()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#rendernothing)

Typically used inside of [`branch()`](#branch)

For example:

```js
const Message = flowMax(
  branch(({data}) => !data, renderNothing()),
  ({data}) =>
    <span>{data.message}</span>
)
```

### `returns()`

```js
returns(
  (props: Object) => returnValue: any
): MagicReturnValue
```

A "magic" helper that always returns the return value of its argument (as the return value of the whole `flowMax()`)

Since it's magic, you must wrap with [`flowMax()`](#flowmax) instead of `flow()`

Doesn't wrap any hooks, just a convenience helper somewhat comparable to Recompose's [`renderComponent()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#rendercomponent)

Typically used inside of [`branch()`](#branch)

For example:

```js
const Message = flowMax(
  branch(({data}) => !data, returns(() => <Loading />)),
  ({data}) =>
    <span>{data.message}</span>
)
```

### `addPropTypes()`

```js
addPropTypes(
  propTypes: object
): Function
```

A "magic" helper that assigns to the `propTypes` property of the current point in the `flowMax()`

Since it's magic, you must wrap with [`flowMax()`](#flowmax) instead of `flow()`

Doesn't wrap any hooks, just a convenience helper comparable to Recompose's [`setPropTypes()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#setproptypes)

For example:

```js
const Maybe = flowMax(
  addProps(({isIt}) => ({message: isIt ? 'yup' : 'no'}),
  addPropTypes({
    isIt: PropTypes.bool,
    message: PropTypes.string.isRequired
  }),
  ({message}) =>
    <span>{message}</span>
)

<Maybe isIt={true} />
```

### `addWrapper()`

```js
addWrapper(
  ({
    props: Object,
    render: (additionalProps: ?Object) => any
  }) => any
): Function
```

A "magic" helper that allows taking control of the rendering of the rest of the `flowMax()`. Use cases could be to render additional JSX/markup wrapping or side-by-side with the JSX returned at the end of the `flowMax()`

The supplied callback receives an object with `props` (the incoming props) and a `render` function. `render()` will render the rest of the `flowMax()`. It optionally accepts additional props to pass to the next step in the `flowMax()` (which will also get "forwarded" the incoming `props`. Additional props passed via `render()` take precedence over forwarded `props`)

Since it's magic, you must wrap with [`flowMax()`](#flowmax) instead of `flow()`

Doesn't wrap any hooks, just a convenience helper

For example:

```js
const WrapInHeader = ({children, header}) =>
  <div>
    <h1>{header}</h1>
    {children}
  </div>

const Outer = flowMax(
  addWrapper(({props, render}) =>
    <WrapInHeader header={props.header}>
      {render({style: {color: 'red'}})}
    </WrapInHeader>
  ),
  ({message, style}) =>
    <span style={style}>{message}</span>
)

<Outer header="Topsy" message="Turvy"/>
```

### `flowMax()`

```js
flowMax(
  pipelineFunction: (incomingProps: Object) => Object,
  ...
): Function
```

A wrapper that replaces `flow()` when your pipeline uses a "magic" helper (`addPropTypes()`, `addWrapper()`, `renderNothing()` or `returns()`)

For example:

```js
const Message = flowMax(
  branch(({data}) => !data, returns(<Loading />)),
  ({data}) =>
    <span>{data.message}</span>
)
```

## Bonus: use `ad-hok`/`flowMax()` in non-React contexts

Once you get used to `ad-hok`'s helpers, you may find that some of them come in handy when writing typical non-React `flow()`s

For example, `addProps()` is a nice shorthand for `obj => ({...obj, someAdditionalProps})`:
```js
flow(
  ({a, ...obj}) => ({
    ...obj,
    a,
    b: a + 2
  })
)
// vs:
flow(
  addProps(({a}) => ({b: a + 2})
)
```
And the "magic" helpers like `branchPure()`/`returns()` can be powerful:
```js
const maybeReturnsThree = x => {
  if (x < 2) return 3
  
  return x + 4
}
// vs:
const maybeReturnsThree = flowMax(
  branchPure(x => x < 2, returns(3)),
  x => x + 4
)
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
