# Using ad-hok with Typescript

Ad-hok and Typescript play quite nicely together!

## Table of Contents

- [Installation](#installation)
- [Declaring component types](#declaring-component-types)
- [Declaring types for ad-hok helpers](#declaring-types-for-ad-hok-helpers)
- [Tips](#tips)
  * [Passing additional props to `addWrapper()`'s `render()` callback](#passing-additional-props-to-addwrappers-render-callback)
  * [Inferring `addState()` state value types](#inferring-addstate-state-value-types)
  * [Explicitly annotate handler param types](#explicitly-annotate-handler-param-types)
  * [How to type `addWrapperHOC()`](#how-to-type-addwrapperhoc)
  * [Narrowing prop types across a `branch()`](#narrowing-prop-types-across-a-branch)


## Installation

If you're using version 0.1.1 or higher of ad-hok, it ships with its own Typescript typings.
So if you have an existing Typescript + React project, just add `ad-hok` as a dependency:
```
$ npm install --save ad-hok

# or if you use yarn:

$ yarn add ad-hok
```

## Declaring component types

Declare your ad-hok `flowMax()` components using `React.FC`:

```typescript
import {FC} from 'react'

interface Props {
  name: string
  className: string
}

const MyComponent: FC<Props> = flowMax(
  addProps(({name}) => ({
    greeting: `Hello ${name}!`,
  })),
  ({greeting, className}) => <div className={className}>{greeting}</div>
)
```

Typescript follows the flow of props down the chain, you should see the expected types
for props added by ad-hok helpers (eg `addState()`, `addProps()`, etc) as well as the
declared "external" prop types

## Declaring types for ad-hok helpers

From a typing perspective, we can think of ad-hok helpers in terms of which "incoming" props
they expect to be present and which (if any) props they'll add to the chain

We'll always explicitly assign a type to the helper's variable name (rather than eg trying to type
the helper's implementation inline), treating the incoming props type as a generic `TProps`


#### Simple adding of props

So for example, here's a helper that just adds a prop:
```typescript
type AddFoo = <TProps>(props: TProps) => TProps & {foo: number}

const addFoo: AddFoo = flowMax(
  addProps({
    foo: 3
  })
)
```

Ad-hok comes with some helper types to simplify these helper type declarations: `SimplePropsAdder`,
`CurriedPropsAdder`, `SimpleUnchangedProps` and `CurriedUnchangedProps`. A "simple" helper is one that
gets added to the chain without function-call parens (eg just `addFoo`) vs a "curried" helper which gets
called explicitly, sometimes with arguments (eg `addPropIdentityStabilization('someProp')`)

So the above example is a "simple" helper that adds props ie a `SimplePropsAdder` and could be typed like:
```
import {SimplePropsAdder, addProps, flowMax} from 'ad-hok'

type AddFoo = SimplePropsAdder<{foo: number}>

const addFoo: AddFoo = flowMax(
  addProps({
    foo: 3
  })
)

// or if you prefer, don't predeclare the type:

const addFoo: SimplePropsAdder<{foo: number}> = flowMax(
  addProps({
    foo: 3
  })
)
```

#### Constraint on incoming props

When our helper requires that certain props be present already, we need to describe that constraint on the incoming `TProps`:

```typescript
type AddIncrementedFoo = <TProps extends {foo: number}>(props: TProps) => TProps & {incrementedFoo: number}

const addIncrementedFoo: AddIncrementedFoo = addProps(({foo}) => ({
  incrementedFoo: foo + 1
}))
```

Now Typescript will flag any use of `addIncrementedFoo` that doesn't meet the constraint:
```typescript
const MyGoodComponent: FC = flowMax(
  addFoo,
  addIncrementedFoo,
  ({foo, incrementedFoo}) => <div>{foo} is one less than {incrementedFoo}</div>
)

const MyBadComponent: FC = flowMax(
  addIncrementedFoo, // Argument of type 'AddIncrementedFoo' is not assignable to parameter of type '(a: { children?: ReactNode; }) => { foo: number; } & { incrementedFoo: number; }'.
                     //   Types of parameters 'props' and 'a' are incompatible.
                     //     Property 'foo' is missing in type '{ children?: ReactNode; }' but required in type '{ foo: number; }'.
  ({incrementedFoo}) => <div>{incrementedFoo}</div>
)
```
(when there's a constraint on `TProps`, we can't use the `SimplePropsAdder` helper since it assumes a plain old `TProps` generic)

#### Curried helpers

Let's type an `addCount()` helper that exposes `count` + `setCount` props and takes an initial value:
```typescript
type AddCount = <TProps>(initialValue: number) => (props: TProps) => TProps & {
  count: number
  setCount: (newCount: number | ((oldCount: number) => number)) => void
}

const addCount: AddCount = (initialValue) =>
  addState('count', 'setCount', initialValue)
  
const MyComponent: FC = flowMax(
  addCount(10),
  ({count, setCount}) =>
    <div>
      <p>The count is {count}</p>
      <button onClick={() => setCount(count + 5)}>increment by 5</button>
    </div>
)
```

Often, the arguments supplied to a curried helper will need to reference `TProps`:
```typescript
type AddCount = <TProps>(getInitialValue: ((props: TProps) => number)) => (props: TProps) => TProps & {
  count: number
  setCount: (newCount: number | ((oldCount: number) => number)) => void
}

const addCount: AddCount = (getInitialValue) =>
  addState('count', 'setCount', props => getInitialValue(props))

const MyComponent: FC<{initialCount: number}> = flowMax(
  addCount(({initialCount}) => initialCount),
  ({count, setCount}) =>
    <div>
      <p>The count is {count}</p>
      <button onClick={() => setCount(count + 5)}>increment by 5</button>
    </div>
)
```

We can also use the `CurriedPropsAdder` helper type to simplify the type definition:
```typescript
import {CurriedPropsAdder} from 'ad-hok'

type AddCount = <TProps>(getInitialValue: ((props: TProps) => number)) => CurriedPropsAdder<TProps, {
  count: number
  setCount: (newCount: number | ((oldCount: number) => number)) => void
}>

...
```

#### Unchanged props

For helpers that don't add any props, they effectively just pass through an unmodified `TProps`:
```typescript
import {SimpleUnchangedProps, CurriedUnchangedProps, addEffect} from 'ad-hok'

type AddGreetingOnMount = <TProps>(props: TProps) => TProps

// or, using the SimpleUnchangedProps helper type:

type AddGreetingOnMount = SimpleUnchangedProps

const addGreetingOnMount: AddGreetingOnMount = addEffect(() => () => {
  window.alert("Hello!")
}, [])



type AddDelayedGreetingOnMount = <TProps>(delay: number) => (props: TProps) => TProps

// or, using the CurriedUnchangedProps helper type:

type AddDelayedGreetingOnMount = <TProps>(delay: number) => CurriedUnchangedProps<TProps>

const addDelayedGreetingOnMount: AddDelayedGreetingOnMount = (delay) => addEffect(() => () => {
  setTimeout(() => {
    window.alert("Hello!")
  }, delay)
}, [])



type AddPersonalizedGreetingOnMount = <TProps extends {name: string}>(props: TProps) => TProps

const addPersonalizedGreetingOnMount: AddPersonalizedGreetingOnMount = addEffect(({name}) => () => {
  window.alert(`Hello, ${name}!`)
}, [])
```

#### Dynamic prop names

Often, helpers take the name of an incoming prop and/or the name of a prop to add as arguments:
```typescript
type AddDoubled = <
  TPropName extends string,
  // describe the constraint on incoming TProps:
  TProps extends {
    [propName in TPropName]: number
  },
  TAddedPropName extends string
>(
  propName: TPropName,
  addedPropName: TAddedPropName
) => (
  props: TProps
) => TProps &
  {
    [addedPropName in TAddedPropName]: number
  }
  
// or, using the CurriedPropsAdder helper type:

type AddDoubled = <
  TPropName extends string,
  TProps extends {
    [propName in TPropName]: number
  },
  TAddedPropName extends string
>(
  propName: TPropName,
  addedPropName: TAddedPropName
) => CurriedPropsAdder<
  TProps,
  {
    [addedPropName in TAddedPropName]: number
  }
>

const addDoubled: AddDoubled = (propName, addedPropName) =>
  flowMax(
    addProps(
      ({[propName]: propValue}) =>
        ({
          [addedPropName]: propValue * 2,
        } as {
          [addPropName in typeof addedPropName]: number
        }),
      [propName]
    )
  )

const MyComponent: FC = flowMax(
  addProps({
    foo: 2,
  }),
  addDoubled('foo', 'doubledFoo'),
  ({foo, doubledFoo}) => <div>{doubledFoo} is twice as much as {foo}</div>
)
```
Notice how Typescript needed a little help to be convinced that our added props matched the declared type (otherwise
it infers a more generic index signature). If you're confident that your helper is implemented correctly, it's also
"safe" to just use `as any` to silence type errors like this - the declared helper type (eg here `AddDoubled`) "wins" so the
`any`-typing will only be "locally scoped" to the internals of the helper definition



#### Further reading

I'd suggest looking at the source code of [`ad-hok-utils`](https://github.com/helixbass/ad-hok-utils)
for various examples of how to type helpers



## Tips

### Passing additional props to `addWrapper()`'s `render()` callback

When using [`addWrapper()`](../README.md#addwrapper), often you'll invoke its `render()` callback
without passing it an additional-props argument:
```typescript
const MyComponent: FC<{x: number}> = flowMax(
  addWrapper((render, {x}) =>
    <SomeContext.Provider value={{x}}>
      {render()}
    </SomeContext.Provider>
  ),
  ({x}) => <div>{x}</div>
)
```

When you do want to pass additional props to `render()`, Typescript can't infer the types
without a little extra guidance. So we use the `AddWrapperRenderCallback`
helper type to declare the type of the additional props:
```typescript
import {AddWrapperRenderCallback, flowMax, addWrapper} from 'ad-hok'

const MyComponent: FC = flowMax(
  addWrapper((render: AddWrapperRenderCallback<{width: number, height: number}>) =>
    <SomeRenderPropComponent>
      {(width, height) => render({width, height})}
    </SomeRenderPropComponent>
  ),
  ({width, height}) => <div>The dimensions are {width}x{height}</div>
)
```

### Inferring `addState()` state value types

Often, Typescript can infer the type of a state value correctly from the initial state value:
```typescript
const MyComponent: FC = flowMax(
  addState('count', 'setCount', 0), // infers number
  addState('shouldShow', 'setShouldShow', false), // infers boolean
  ({count, setCount, shouldShow, setShouldShow}) =>
    <div>
      {shouldShow && <p>The count is {count}</p>}
      <button onClick={() => setShouldShow(!shouldShow)}>toggle</button>
      <button onClick={() => setCount(5)}>change count</button>
    </div>
)
```

But in other cases Typescript can't just infer the correct state value type:
```typescript
const MyBadComponent: FC<{names: string[]}> = flowMax(
  addDisplayName('MyBadComponent'),
  addState('selectedIndex', 'setSelectedIndex', null),
  ({names, selectedIndex, setSelectedIndex}) => (
    <div>
      {names.map((name, index) => (
        <div key={index}>
          {name} {selectedIndex === index ? 'is selected' : 'is not selected'}
          <button
            onClick={() => {
              setSelectedIndex(index) // Argument of type 'number' is not assignable to parameter of type '((prevState: null) => null) | null'.
            }}
          >
            select
          </button>
        </div>
      ))}
    </div>
  )
)
```

We have a couple options for telling Typescript what the correct type is for the state value.
You might imagine a generic syntax like this:
```typescript
addState<number | null>('selectedIndex', 'setSelectedIndex', null)
```
Unfortunately, that's not an option given how Typescript currently works<sup name="no-partial-inference">[1](#footnote-no-partial-inference)</sup>

One option is to cast the initial value:
```typescript
addState('selectedIndex', 'setSelectedIndex', null as number | null)
```
This works fine but is technically unsafe because you're casting in an unsafe way

So one way to safely achieve explicit typing of the state value is to use the callback-style initial value and annotate the return type:
```typescript
addState('selectedIndex', 'setSelectedIndex', (): number | null => null)
```

Or you could use an explicit-typing helper like `typedAs()`:
```typescript
const typedAs = <TValue,>(value: TValue): TValue => value

addState('selectedIndex', 'setSelectedIndex', typedAs<number | null>(null))
```

### Explicitly annotate handler param types

Due to the way that `addHandlers()` and `addStateHandlers()` are typed, if you don't type-annotate the "inner" handler function
params, Typescript will silently allow them to be implicitly `any`-typed:
```typescript
const MyBadComponent: FC = flowMax(
  addStateHandlers(
    {
      count: 0,
    },
    {
      incrementBy: ({count}) => (by) => ({
        // by is implicitly any
        count: count + by,
      }),
    }
  ),
  addHandlers({
    alertName: ({count}) => (name) => {
      // name is implicitly any
      window.alert(`${name.toUpperCase()}, the count is ${count}`)
    },
  }),
  ({incrementBy, alertName}) => (
    <div>
      <button
        onClick={() => {
          alertName({name: 'Larry'}) // uh-oh, this will crash at runtime
        }}
      >
        Tell me
      </button>
      <button
        onClick={() => {
          incrementBy('5') // uh-oh, this won't do what we want
        }}
      >
        Increase
      </button>
    </div>
  )
)
```

So you should always explicitly annotate the types of "inner" handler function params:
```typescript
const MyBetterComponent: FC = flowMax(
  addStateHandlers(
    {
      count: 0,
    },
    {
      incrementBy: ({count}) => (by: number) => ({
        count: count + by,
      }),
    }
  ),
  addHandlers({
    alertName: ({count}) => (name: string) => {
      window.alert(`${name.toUpperCase()}, the count is ${count}`)
    },
  }),
  ({incrementBy, alertName}) => (
    <div>
      <button
        onClick={() => {
          alertName({name: 'Larry'}) // Argument of type '{ name: string; }' is not assignable to parameter of type 'string'.
        }}
      >
        Tell me
      </button>
      <button
        onClick={() => {
          incrementBy('5') // Argument of type '"5"' is not assignable to parameter of type 'number'.
        }}
      >
        Increase
      </button>
    </div>
  )
)
```

Since this is easy to forget to do, [`eslint-plugin-ad-hok`](https://github.com/helixbass/eslint-plugin-ad-hok) includes an
`annotate-handler-param-types` rule that's included in its `recommended-typescript` config that will flag "inner" handler
function params without an explicit type annotation


### How to type `addWrapperHOC()`

When using [`addWrapperHOC()`](../README.md#addwrapperhoc) to include a higher-order component in a component chain, rather than
trying to "honestly" type the higher-order component (which can be tricky and makes it hard for Typescript to understand how it
modifies the props object for the rest of the chain), you're expected to use the provided `PropAddingHOC` helper to describe the
additional props (if any) added by the HOC:
```typescript
import {withNavigation, NavigationInjectedProps} from 'react-navigation'
import {PropAddingHOC, flowMax} from 'ad-hok'

const MyComponent: FC = flowMax(
  addWrapperHOC(withNavigation as PropAddingHOC<NavigationInjectedProps>),
  addHandlers({
    onPress: ({navigation}) => () => {
      navigation.navigate('Home')
    },
  }),
  ({onPress}) => <Button onPress={onPress}>Go home</Button>
)
```

If you run up against the limitations of this approach (eg if the prop signature of your HOC is dynamic), please
[file an issue](https://github.com/helixbass/ad-hok/issues) and we can help address your use case



### Narrowing prop types across a `branch()`


Typescript is generally quite good at following control flow and correspondingly "narrowing" types eg inside an
`if` branch. So we may tend to expect it to be equally smart at following control flow across an "aborting" `branch()`
(ie one that `renderNothing()`'s or `returns()`). But Typescript doesn't adjust the prop types following a `branch()`
by default

So we can make use of some helpers from [`ad-hok-utils`](https://github.com/helixbass/ad-hok-utils) to handle the
common cases or give us the ability to manually instruct Typescript of the updated prop types

The most common use case for prop-type-narrowing with `branch()` is that we want to abort rendering (possibly showing
eg a loading spinner) if certain props are missing (by some definition of "missing"). If that "missing" condition is
nullishness, we can use [`branchIfNullish()`](https://github.com/helixbass/ad-hok-utils#branchifnullish):
```typescript
const MyComponent: FC<{name?: string, id: string | null}> = flowMax(
  branchIfNullish(['name', 'id']),
  addProps(({id, name}) => ({
    combined: `${id.toUpperCase()} ${name.toUpperCase}`,
  })),
  ({combined}) => <div>{combined}</div>
)
```
Notice how the types of `id` and `name` have been refined to `string` after the `branch()`, which corresponds to the runtime
behavior of `branchIfNullish()` (it will "abort" if either `name` or `id` is nullish)

The other variants of "missing" that `ad-hok-utils` has helpers for out-of-the-box are falsiness
([`branchIfFalsy()`](https://github.com/helixbass/ad-hok-utils#branchiffalsy)) and [`isEmpty()`](https://lodash.com/docs/4.17.15#isEmpty)
([`branchIfEmpty()`](https://github.com/helixbass/ad-hok-utils#branchifempty))

For prop-type narrowing that doesn't fit into one of these boxes, we can fall back to using
[`declarePropTypesNarrowing()`](https://github.com/helixbass/ad-hok-utils#declareproptypesnarrowing) manually after the `branch()`:
```typescript
const MyComponent: FC<{value: string | Date}> = flowax(
  branch(({value}) => isDate(value), returns(({value}) => <FormattedDate date={value} />)),
  declarePropTypesNarrowing<{value: string}>(),
  addProps(({value}) => ({
    valueUppercase: value.toUpperCase()
  })),
  ({valueUppercase}) => <div>{valueUppercase}</div>
)
```



## Footnotes

<b id="footnote-no-partial-inference">1</b> Specifically, Typescript doesn't support explicitly supplying some
generics while inferring others (and we still need to infer eg `TProps`). See eg https://github.com/microsoft/TypeScript/pull/26349
[[back](#no-partial-inference)]





