# Using ad-hok with Typescript

Ad-hok and Typescript play quite nicely together!

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
const My
```

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
