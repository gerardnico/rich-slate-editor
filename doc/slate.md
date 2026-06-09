# Slate

## About

We use `slate` because the [serialization model](https://docs.slatejs.org/concepts/10-serializing) is a Json
like [unified hast model](#to-unified-format)
meaning that we can plug into the unified framework easily.

The actual editor is the sample that shows a rich preview of markdown.

## Tree / Json data / AST

Slate's data structure is immutable, so you can't modify or delete nodes directly.
Immutable with [immer](https://immerjs.github.io/immer/)

2 kinds of nods

* Element node (without the `text` attribute)
* Text node (with the `text` attribute)

### Move Node

From a path to another [path](#path-node-addressing)

```javascript
Transforms.moveNodes(editor, {
    at: [0, 0],
    to: [0, 1],
})
```

### Element Flatten / Unwrap

```javascript
Transforms.unwrapNodes(editor, {
    at: [], // Path of Editor
    match: node =>
        !Editor.isEditor(node) &&
        node.children?.every(child => Editor.isBlock(editor, child)),
    mode: 'all', // also the Editor's children
})
```

### Set properties

Set bold to text node when italic is not true

```javascript
Transforms.setNodes(
    editor,
    {bold: true},
    {
        // This path references the editor, and is expanded to a range that
        // will encompass all the content of the editor.
        at: [],
        // This only matches text nodes that are not already italic.
        match: (node, path) => Text.isText(node) && node.italic !== true,
    }
)
```

### Text node

Text nodes have the `text` attribute.

* Get the string content of an element node.

```javascript
const string = Node.string(element)
```

Insert text at point

```javascript
Transforms.insertText(editor, 'some words', {
    at: {path: [0, 0], offset: 3},
})
```

* Delete all of the content in the range

```javascript
Transforms.delete(editor, {
    at: {
        anchor: {path: [0, 0], offset: 0},
        focus: {path: [1, 0], offset: 2},
    },
})
```

* Insert text nodes

```javascript
Transforms.insertNodes(
    editor,
    {
        text: 'A new string of text.',
    },
    {
        at: [0, 1],
    }
)
```

### Select

* Select nodes

```javascript
// example: replace all image elements with their alt text
const imageElements = Editor.nodes(editor, {
    at: [], // Path of Editor
    match: (node, path) => 'image' === node.type,
    // mode defaults to "all", so this also searches the Editor's children
})
for (const nodeEntry of imageElements) {
    const [node, path] = nodeEntry;
    const altText =
        node.alt ||
        node.title ||
        /\/([^/]+)$/.exec(node.url)?.[1] ||
        '☹︎'
    Transforms.select(editor, path)
    Editor.insertFragment(editor, [{text: altText}])
}
```

* Get the node at a specific path inside a root node.

```
const descendant = Node.get(value, path)
```

* Get the parent element

```
Editor.above
```

## Location / Addressing (at)

Location `at` can be either:

* a [Path](#path-node-addressing),
* a [Point](#point-position-addressing),
* or [Range](#range-span-of-content-addressing)

### Path (Node addressing)

Path is a node addressing in the AST.

* first number, N1, the N1 node after the root
* second number, N2, the N2 node in the N2 node
* ...

The Editor itself has a path of `[]`.
For example, to select the whole contents of the editor, call
`Transforms.select(editor, [])`

Check [slate-select](../__test__/slate-selection.test.tsx) to see the path of a selection.

### Point (Position Addressing)

Point is a path (for a node) and an offset into the text.

Check [slate-select](../__test__/slate-selection.test.tsx) to see the points of a selection.

Get the start point of a Location

```
const start = Editor.start(editor, path)
```

### Range (Span of Content Addressing)

A Range is defined by 2 points, the anchor and the focus.

```javascript
let range = {
    anchor: {path: [0, 0], offset: 0},
    focus: {path: [0, 0], offset: 8},
}
```

Check [slate-select](../__test__/slate-selection.test.tsx) to see the range of a selection.

```javascript
// Get the start and end points of a range in order.
const [start, end] = Range.edges(range)

// Check if a range is collapsed to a single point.
if (Range.isCollapsed(range)) {
    // ...
}
```

## Selection (Cursor)

### Move cursor

```javascript
Transforms.move(editor, {
    distance: 3,
    unit: 'word',
    reverse: true,
})
```

### Set the selection to a new range

```javascript
Transforms.select(editor, {
    anchor: {path: [0, 0], offset: 0},
    focus: {path: [1, 0], offset: 2},
})
```

## Data / Model

See:

* [Interface](https://docs.slatejs.org/concepts/01-interfaces)
* [Nodes](https://docs.slatejs.org/concepts/02-nodes)

## Serialization

### To Slate format

`slate-hyperscript` is the built-in helper to build Slate trees from:

* HTML
* Jsx

It contains a `hyperscript` helper for creating Slate documents with JSX.

See example in [the deserialization section](https://docs.slatejs.org/concepts/10-serializing#deserializing)

### To Unified Format

The [Json representation](https://docs.slatejs.org/concepts/10-serializing) of the DOM is a `hast` like:

* as input in the `value` prop of `Editable`
* get back the output as `hast` [value - into a database](https://docs.slatejs.org/walkthroughs/06-saving-to-a-database)

We can then plug in the unified framework to write back `markdown` file.

Example: [Slate to unist](https://github.com/togglhire/slate-unist-serializer)

## Production

[Make the bundle smaller via the UMD](https://docs.slatejs.org/walkthroughs/xx-using-the-bundled-source)

## Plugin

This package is a [plugin system](rich-slate.md#plugin)

See also:

* the [plugin](https://docs.slatejs.org/concepts/08-plugins) for creation
* the [resources page for a list](https://docs.slatejs.org/general/resources)

Others:

* [Npm](https://www.npmjs.com/search?q=keywords%3Aslate-plugins)
* [Awesome Slate](https://github.com/arahansen/awesome-slate)
* List of plugin with a cloud offering for image https://plate.udecode.io/
  * [Drag And Drop Block](https://plate.udecode.io/docs/components/dnd)
* [Slate Yjs](https://github.com/BitPhinix/slate-yjs) for collaborative editing
