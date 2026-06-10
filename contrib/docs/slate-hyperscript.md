# Slate Hyperscript


## About

Slate hyperscript is a way to transform Jsx language into the Slate editor state.

## How it works

By default, the constructor of a node is `React.createElemnt`
but you can define another constructor called the `jsxFactory` with the `@jsx` construct

Steps:
* At the top of your file, the below statement state that to construct element,
you need to use the `jsx` variable.
```jsx
/** @jsx jsx */
```
* Then to avoid [pragmaFrag cannot be set when runtime is automatic](https://dev.to/samby_mahapatra/how-to-solve-pragma-and-pragmafrag-can-not-be-set-while-runtime-is-automatic-error-1i4c)
```jsx
/** @jsxRuntime classic */
```
* Then you import the `jsx` variable factory from [jsxFactory.ts](../../__test__/jsxFactory.ts) that defines your node
```jsx
import {jsx} from './jsxFactory'
```
* You can then define Slate state via Jsx

```jsx
const editor = (
    <editor>
        <element tag="p">The slate element based node, a line of text in a paragraph</element>
        <paragraph>The same node but defined in the jsx factory</paragraph>
    </editor>
)
```

* And use it in your code

Check the [Factory](../../__test__/jsxFactory.ts)

## Doc / Reference

* [A slate explanation](https://docs.slatejs.org/concepts/10-serializing#deserializing)

JsxFactory in the wild:
* [Babel](https://babeljs.io/docs/babel-plugin-transform-react-jsx#customizing-the-classic-runtime-import)
* [Typescript JsxFactory](https://www.typescriptlang.org/tsconfig#jsxFactory)
* [Eslint used by Vite... does not support by file](https://esbuild.github.io/content-types/#jsx)
