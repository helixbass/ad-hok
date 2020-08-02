# ad-hok

ad-hok is a set of helpers that let you use React [hooks](https://reactjs.org/docs/hooks-intro.html) in a [functional pipeline](https://www.martinfowler.com/articles/collection-pipeline/) style. Its API and concept are inspired by [Recompose](https://github.com/acdlite/recompose).

**For an introductory comparison of `ad-hok` vs "vanilla" hooks, see [this article](http://helixbass.net/blog/ad-hok-intro-at-a-glance/).**

## Table of Contents

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Usage with Typescript](#usage-with-typescript)
- [API](#api)
  * [addState()](#addstate)
  * [addEffect()](#addeffect)
  * [addLayoutEffect()](#addlayouteffect)
  * [addProps()](#addprops)
  * [addDefaultProps()](#adddefaultprops)
  * [addHandlers()](#addhandlers)
  * [addStateHandlers()](#addstatehandlers)
  * [addRef()](#addref)
  * [addContext()](#addcontext)
  * [addReducer()](#addreducer)
  * [addMemoBoundary()](#addmemoboundary)
  * [branch()](#branch)
  * [branchPure()](#branchpure)
  * [renderNothing()](#rendernothing)
  * [returns()](#returns)
  * [addPropTypes()](#addproptypes)
  * [addWrapper()](#addwrapper)
  * [addWrapperHOC()](#addwrapperhoc)
  * [flowMax()](#flowmax)
- [Bonus: usage in non-React contexts](#bonus-use-ad-hokflowmax-in-non-react-contexts)
- [Motivation](#motivation)
- [React hooks equivalents](#react-hooks-equivalents)
- [Help / Contributions / Feedback](#help--contributions--feedback)
- [License](#license)

## Installation

```
$ npm install --save ad-hok
```

##### Recommended: ESLint

If you're using [ESLint](https://eslint.org), you may want to install [`eslint-plugin-ad-hok`](https://github.com/helixbass/eslint-plugin-ad-hok) to enforce `ad-hok` best practices
```
$ npm install --save-dev eslint-plugin-ad-hok
```
In your `.eslintrc`:
```
"extends": ["plugin:ad-hok/recommended"]
```

##### Recommended: Babel display name plugin

If you're using [Babel](https://babeljs.io), you may want to install [`babel-plugin-transform-react-display-name-pipe`](https://github.com/helixbass/babel-plugin-transform-react-display-name-pipe) for nicer component display names when debugging
```
$ npm install --save-dev babel-plugin-transform-react-display-name-pipe
```
In your `.babelrc` (or `babel.config.js`):
```
"plugins": ["transform-react-display-name-pipe"]
```

## Basic usage

```
import {addState, addHandlers, flowMax} from 'ad-hok'

const Counter = flowMax(
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

ad-hok helpers are composed using `flowMax()`

Compare this to using Recompose's [`compose()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#compose):
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

## Usage with Typescript

Ad-hok works nicely with Typescript, see our [guide to ad-hok + Typescript](./docs/typescript.md)

## API

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
const Counter = flowMax(
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
  dependencies?: Array<string> | (oldProps: Object, newProps: Object) => boolean
): Function
```

Accepts a function of props that returns a function (which gets passed to [`useEffect()`](https://reactjs.org/docs/hooks-reference.html#useeffect)). Used for imperative, possibly effectful code

The optional second argument is a [dependencies argument](#dependencies-arguments). It corresponds to the [second argument to `useEffect()`](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)

For example:

```js
const Example = flowMax(
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

### `addLayoutEffect()`

```js
addLayoutEffect(
  callback: (props: Object) => Function,
  dependencies?: Array<string> | (oldProps: Object, newProps: Object) => boolean
): Function
```

Accepts a function of props that returns a function (which gets passed to [`useLayoutEffect()`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)). Used for imperative, possibly effectful code. The signature is identical to `addEffect`, but it fires synchronously after all DOM mutations

The optional second argument is a [dependencies argument](#dependencies-arguments). It corresponds to the [second argument to `useLayoutEffect()`](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)

For example:

```js
const Example = flowMax(
  addState('count', 'setCount', 0),
  addLayoutEffect(({count}) => () => {
    document.title = `You clicked ${count} times`
  }, ['count']),
  addLayoutEffect(() => () => {
    console.log("I get called on every re-render")
  }),
  addLayoutEffect(() => () => {
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
  dependencies?: Array<string> | (oldProps: Object, newProps: Object) => boolean
): Function
```

Accepts a function that returns additional props based on the incoming props. Or accepts an object of additional props. The additional props get merged with the incoming props

The optional second argument is a [dependencies argument](#dependencies-arguments) that controls memoization of the added props. This can be used to avoid expensive recomputation or to stabilize prop identity across rerenders (allowing for downstream `shouldComponentUpdate()`/`React.memo()` optimizations that rely on prop equality)

Doesn't wrap any hooks (other than `useMemo()` for the dependency tracking), just a convenience helper comparable to Recompose's [`withProps()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withprops)

For example:

```js
const Doubler = flowMax(
  addProps(({num}) => ({num: num * 2})),
  ({num}) =>
    <div>Number: {num}</div>
)

const Outer = () =>
  <Doubler num={3}> // renders "Number: 6"
  
const OptimizedDoubler = flowMax(
  addProps(({num}) => ({num: num * 2}), ['num']),
  ({num}) =>
    <div>Number: {num}</div>
)
```

### `addDefaultProps()`

```js
addDefaultProps(
  defaults: (incomingProps: Object) => Object | Object,
): Function
```

Adds some props only if they are not already present in the incoming props (ie. if they are `null` or `undefined`).

For example:

```js
const Greeting = flowMax(
  addDefaultProps({
    name: 'world',
  }),
  ({name}) => <div>Hello, {name}!</div>
)

const AnonymousGreeting = () =>
  <Greeting /> // renders "Hello, world!"

const ReactGreeting = () =>
  <Greeting name="React" /> // renders "Hello, React!"
```

### `addHandlers()`

```js
addHandlers(
  handlerCreators: {
    [handlerName: string]: (props: Object) => Function
  },
  dependencies?: Array<string> | (oldProps: Object, newProps: Object) => boolean
): Function
```

Takes an object map of handler creators. These are higher-order functions that accept a set of props and return a function handler.

The optional second argument is a [dependencies argument](#dependencies-arguments) that controls memoizing the handlers. Stabilizing the handlers' identities across rerenders allows for downstream `shouldComponentUpdate()`/`React.memo()` optimizations that rely on prop equality

Doesn't wrap any hooks (other than `useMemo()` when passing the optional `dependencies` argument), just a convenience helper comparable to Recompose's [`withHandlers()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withhandlers)

For example:

```js
const ClickLogger = flowMax(
  addHandlers({
    onClick: ({onClick}) => (...args) => {
      console.log('click')
      onClick(...args)
    }
  }),
  ({onClick}) =>
    <button onClick={onClick}>click me</button>
)

const Fetcher = flowMax(
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
  initialState: Object | (props: Object) => Object
  stateUpdaters: {
    [key: string]: (state: Object, props: Object) => (...payload: any[]) => Object
  }
): Function
```

Adds additional props for state object properties and immutable updater functions in a form of `(...payload: any[]) => Object`

`addStateHandlers()` doesn't accept a dependencies argument because the identity of the exposed handlers is always stable

Wraps [`useReducer()`](https://reactjs.org/docs/hooks-reference.html#usereducer) hook

Comparable to Recompose's [`withStateHandlers()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#withstatehandlers)

For example:

```js
const Counter = flowMax(
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
  initialValue: (incomingProps: Object) => any | any,
): Function
```

Adds an additional prop of the given name whose value is a ref initialized to the given initial value

Wraps [`useRef()`](https://reactjs.org/docs/hooks-reference.html#useref) hook

For example:

```js
const Example = flowMax(
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

const Example = flowMax(
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

### `addReducer()`

```js
addReducer(
  reducer: (prevState: Object, action: any) => Object,
  initialState: Object | (props: Object) => Object,
): Function
```

Adds additional props for state object properties and the reducer `dispatch` function

Wraps [`useReducer()`](https://reactjs.org/docs/hooks-reference.html#usereducer) hook

For example:

```js
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

const initialState = {count: 0}

const Counter = flow(
  addReducer(reducer, initialState),
  ({count, dispatch}) =>
    <>
      Count: {count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
)
```

`addReducer()` is a wrapper around a "static reducer". If you want to wrap a "reducer over props"
(as described in [this article](https://overreacted.io/a-complete-guide-to-useeffect/#why-usereducer-is-the-cheat-mode-of-hooks)),
you can use [`addReducerOverProps()`](https://github.com/helixbass/ad-hok-utils#addreduceroverprops) from
[`ad-hok-utils`](https://github.com/helixbass/ad-hok-utils).
It should be mentioned that [`addStateHandlers()`](#addstatehandlers) is similar to a reducer over props (in fact it's implemented
using one) and is arguably more convenient/streamlined than a reducer is

### `addMemoBoundary()`

```js
addMemoBoundary(
  dependencies?: Array<string> | (oldProps: Object, newProps: Object) => boolean
): Function
```

Avoids unnecessary re-rendering of everything below it in a `flowMax` chain

Wraps [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo)

The optional argument is an array of names of props that should trigger re-rendering whenever one of those props changes (based on `===` comparison). If the argument is omitted, re-rendering will occur whenever _any_ prop changes (like `React.memo()`'s default behavior)

For example:

```js
const DefaultDoubler = flowMax(
  addMemoBoundary(), // this component will re-render whenever any of its props changes
  addProps(({num}) => ({doubled: num * 2})),
  ({doubled}) =>
    <div>Doubled: {doubled}</div>
)

const PropsArrayDoubler = flowMax(
  addMemoBoundary(["num"]), // this component will re-render whenever its `num` prop changes
  addProps(({num}) => ({doubled: num * 2})),
  ({doubled}) =>
    <div>Doubled: {doubled}</div>
)
```

### `branch()`

```js
branch(
  test: (props: Object) => boolean,
  left: (incomingProps: Object) => Object,
  right: ?(incomingProps: Object) => Object
): Function
```

A helper that accepts a test function and two functions. The test function is passed the incoming props. If it returns true, the left function is called with the incoming props; otherwise, the right function is called. If the right is not supplied, it will by default pass through the incoming props.

Doesn't wrap any hooks, just a convenience helper comparable to Recompose's [`branch()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#branch)

Typically used along with [`renderNothing()`](#rendernothing)/[`returns()`](#returns) to do conditional rendering

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

A helper that always renders `null` (as the return value of the whole `flowMax()`)

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

A helper that always returns the return value of its argument (as the return value of the whole `flowMax()`)

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

A helper that assigns to the `propTypes` property of the current point in the `flowMax()`

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
  (
    render: (additionalProps: ?Object) => any,
    props: Object
  ) => any
): Function
```

A helper that allows taking control of the rendering of the rest of the `flowMax()` chain. Use cases could be to render additional JSX/markup wrapping or side-by-side with the JSX returned at the end of the `flowMax()`

The supplied callback receives a `render` function and the incoming `props`. `render()` will render the rest of the chain. It optionally accepts additional props to pass to the next step in the chain (which will also get "forwarded" the incoming `props`. Additional props passed via `render()` take precedence over forwarded `props`)

Doesn't wrap any hooks, just a convenience helper

For example:

```js
const MaybeShowMessage = flowMax(
  addWrapper((render, props) =>
    <div>
      <h1>{props.header}</h1>
      {render()}
    </div>
  ),
  addProps(() => ({
    shouldShowMessage: !!random(),
  })),
  branch(({shouldShowMessage}) => !shouldShowMessage, renderNothing()),
  ({message}) =>
    <span>{message}</span>
)

<MaybeShowMessage
  header="This always gets rendered"
  message="This maybe gets rendered"
/>
```

### `addWrapperHOC()`

```js
addWrapperHOC(
  hoc: HigherOrderComponent
): Function
```

A helper that allows wrapping an existing [higher-order component](https://reactjs.org/docs/higher-order-components.html).

Doesn't wrap any hooks, just a convenience helper

For example:

```js
import {withNavigation} from 'react-navigation'

const BackButton = flowMax(
  addWrapperHOC(withNavigation),
  ({navigation, children}) =>
    <Button onPress={() => navigation.goBack()}>
      <Text>{children}</Text>
    </Button>
)

<BackButton>Back</BackButton>
```

### `flowMax()`

```js
flowMax(
  pipelineFunction: (incomingProps: Object) => Object,
  ...
): Function
```

Used to compose helpers together into a single chain encapsulating your component

Comparable to Recompose's [`compose()`](https://github.com/acdlite/recompose/blob/master/docs/API.md#compose). Works like [`lodash/fp`](https://github.com/lodash/lodash/wiki/FP-Guide)'s [`flow()`](https://simonsmith.io/dipping-a-toe-into-functional-js-with-lodash-fp/), with some additional "magic"

For example:

```js
const Message = flowMax(
  branch(({data}) => !data, returns(<Loading />)),
  ({data}) =>
    <span>{data.message}</span>
)
```

#### Dependencies arguments

Several helpers accept an optional "dependencies" argument specifying conditions under which that helper should "re-run" (eg recompute its values, or retrigger its effect). This is conceptually parallel to e.g. [`useEffect()`](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)'s or [`useMemo()`](https://reactjs.org/docs/hooks-reference.html#usememo)'s dependencies argument

This dependencies argument cah either be specified as a simple declarative "dependencies list" of props, or as a callback comparing old vs new props

A "dependencies list" is an array of strings that are Lodash [`get()`](https://lodash.com/docs/4.17.15#get)-style "paths" into the props object. The helper re-runs whenever any of the corresponding values in the props object change _identity_

So for example this specifies that the effect should retrigger whenever the `message` prop changes or the `language` property of the `settings` prop changes:
```js
addEffect(({message, settings}) => () => {
  const translatedMessage = getTranslatedMessage(message, settings.language)
  alert(translatedMessage)
}, ['message', 'settings.language'])
```

When the condition for re-running the helper can't easily be expressed as a dependencies list, you can instead use a callback that compares old vs new props and returns true if the helper should re-run:
```js
addEffect(
  ({count}) => () => {
    console.log(`count just increased by > 1: ${count}`)
  },
  (oldProps, newProps) => newProps.cound - oldProps.count > 1
)
```

The callback won't be called on the initial render so you can always safely assume that `oldProps` exists

## Bonus: use `ad-hok`/`flowMax()` in non-React contexts

Once you get used to `ad-hok`'s helpers, you may find that some of them come in handy when writing typical non-React code where you'd usually use `lodash/fp`'s `flow()`

For example, `addProps()` is a nice shorthand for `obj => ({...obj, someAdditionalProps})`:
```js
flow(
  ({a, ...obj}) => ({
    ...obj,
    a,
    b: a + 2
  }),
  ...
)
// vs:
flowMax(
  addProps(({a}) => ({b: a + 2}),
  ...
)
```
And the control-flow helpers like `branchPure()`/`returns()` can be powerful:
```js
const maybeReturnsThree = x => {
  if (x < 2) return 3
  
  return x + 4
}
// vs:
const maybeReturnsThree = flowMax(
  branchPure(x => x < 2, returns(() => 3)),
  x => x + 4
)
```

## Motivation

#### Background

Recompose's approach is an elegant, highly composable way of building up logic out of small "building blocks" (in its case, higher-order components). Once I saw how clearly it expressed the separation between different pieces of functionality and the dependencies between them, it made writing class components look like an unappealing structure where you just have a "flat" set of methods and have to work hard to trace the dependencies between them

#### Enter hooks

Now React hooks have entered the picture. And they're very interesting and the promise of only using function components is great!

But I find the typical usage of hooks to still be less readable (and composable) than Recompose's style. By starting your function component bodies with a bunch of hooks, you're introducing a lot of local variable state. Visually tracking the dependencies between local variables is hard, many consider it good practice to minimize the use of local variables

So you can have the best of both worlds by using ad-hok:
- Use hooks without introducing local variable state
- Easily track dependencies between hooks when scanning code

#### Display components

Another thing you lose with typical hooks usage is the simple ["display component"](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) - your function component body becomes two sections, first a bunch of stuff related to hooks and then rendering. By using ad-hok, you regain the separation of actual rendering from surrounding logic

#### Reuse

In the simplest usage (as in the initial example), the final step in your `flowMax()` is a rendering function. If you want that rendering function to be an actual "display" function component (for reuse and/or eg prop types validation), just use `React.createFactory()`:
```js
import {createFactory} from 'react'

const DisplayCounter = ({count, increment, decrement, reset}) =>
  <>
    Count: {count}
    <button onClick={reset}>Reset</button>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </>

const Counter = flowMax(
  addState('count', 'setCount', 0),
  addHandlers({
    increment: ({ setCount }) => () => setCount(n => n + 1),
    decrement: ({ setCount }) => () =>  setCount(n => n - 1),
    reset: ({ setCount }) => () => setCount(0)
  }),
  createFactory(DisplayCounter) // or equivalently:   props => <DisplayCounter {...props} />
)
```

If you want to be able to reuse chunks of ad-hok "container" logic, just extract and name that part of the `flowMax()`:
```js
const addCounter = flowMax(
  addState('count', 'setCount', 0),
  addHandlers({
    increment: ({ setCount }) => () => setCount(n => n + 1),
    decrement: ({ setCount }) => () =>  setCount(n => n - 1),
    reset: ({ setCount }) => () => setCount(0)
  })
)

const Counter = flowMax(
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

## React hooks equivalents

| React hook                                                                                 | ad-hok                                                  |
|--------------------------------------------------------------------------------------------|---------------------------------------------------------|
| [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate)                       | [`addState`](#addstate)                                 |
| [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect)                     | [`addEffect`](#addeffect)                               |
| [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext)                   | [`addContext`](#addcontext)                             |
| [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer)                   | [`addReducer`](#addreducer)                                                       |
| [`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback)                 | [`addHandlers`](#addhandlers) with a dependencies argument |
| [`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo)                         | [`addProps`](#addprops) with a dependencies argument       |
| [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref)                           | [`addRef`](#addref)                                     |
| [`useImperativeHandle`](https://reactjs.org/docs/hooks-reference.html#useimperativehandle) | -                                                       |
| [`useLayoutEffect`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)         | [`addLayoutEffect`](#addlayouteffect)                   |
| [`useDebugValue`](https://reactjs.org/docs/hooks-reference.html#usedebugvalue)             | -                                                       |

## Help / Contributions / Feedback

Please file an issue or submit a PR with any questions/suggestions

## License

MIT
