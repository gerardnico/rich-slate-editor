# Rich Slate Architecture

## About

`Rich Slate` is our wrapper adaptation of [slate](slate.md).

`Rich` meaning that we have wrapped it as the same meaning of `Rich` in `Rich Text`

## Rich Slate Editor

A minimal rich slate is

```jsx
const richSlateObject = new RichSlateBuilder(name)
    .registerPlugin(new HistoryPluginBuilder())
    .registerPlugin(new BoldMarkPluginBuilder())
    .registerPlugin(new ItalicMarkPluginBuilder())
    .registerPlugin(new UnderlineMarkPluginBuilder())
    .registerPlugin(new HeadingBuilder())
    // ...
    .build();

return (
    <RichSlateEditor richSlate={richSlateObject}>
        <RichSlateEditable/>
    </RichSlateEditor>
)
```

Check the [text editor example](../../src/component/form/RichSlateTextArea.tsx)

## Rich Slate Object

The rich slate object is the wrapper of the `Slate` object

It adds:

* plugin registration
* event handling subscription (so that a React component can subscribe to them)

## Plugin

[Rich Slate Plugin](../../src/plugin/RichSlatePlugin.tsx) is the plugin entry point.

You add a plugin if you want to add a functionality.

A plugin:

* renders leaf or element
* enhances the Slate command at construction
* subscribes and react to events
* registers Toolbar button or portal component
* contains its specific Slate command (insert, delete, ...)

A plugin extends the [Rich Slate Plugin](../../src/plugin/RichSlatePlugin.tsx)

In our plugin systems, there is:

* element plugin to create and manipulate element node
* attribute plugin to add an attribute to a node (text (ie mark) or element)
* storage plugin to store the AST
* behavior plugin to manipulate only event (keyboard, ...)

To share common behaviour, we have created this abstract specialised plugin that you can extend

* [Element Plugin](../../src/plugin/ElementPlugin.ts)
  * [Inline Element Plugin](../../src/plugin/InlineElementPlugin.ts)
  * [Block Element Plugin](../../src/plugin/BlockElementPlugin.tsx)
* Node Attributes:
  * [Mark plugin](../../src/plugin/TextMarkPlugin.ts) for Text node
  * [Attribute plugin](../../src/plugin/ElementAttributePlugin.ts) for Element node
* [Storage Plugin](../../src/plugin/StoragePlugin.ts)

A plugin is a class that:

* implements all commands
* registers the React component (action button, portal, ...)
* extends the slate command at construction

## React Component

Via the `richSlate` object, a plugin can register the following React component:

* a Toolbar button
* a Hoverbar button
* a Portal component (modal to show a form)

These components are used in the following Built-In React component
that you can use to create your editor:

* [RichSlateToolbar](../../src/component/toolbars/RichSlateToolbar.tsx)
* [RichSlateHoveringToolbar](../../src/component/toolbars/RichSlateHoveringToolbar.tsx)
* Portal Component (ie Dialog) are injected at the bottom of the Slate Editor

### React Hook

In a Rich Slate React component, you can:

* get access to the [RichSlate object](#rich-slate-object) via
  the [useRichSlate hook](../../src/component/context/useRichSlate.ts)
* get access to a [plugin](#plugin) via the [useRichSlatePlugin hook](../../src/component/context/useRichSlatePlugin.ts)
* subscribe to event via the `useRichSlateXxxxSubscription` hooks (See below)

### Event Handling

Component can use the hook `useRichSlateXxxxSubscription` to add a callback on each type of event

We have created a subscription model above
the [slate event-handling](https://docs.slatejs.org/libraries/slate-react/event-handling)
so that we can use them in loss component.

### Testing

Check the [test documentation](test.md)

### Plugin Dependencies

Plugin dependencies are marked as optional peer-dependencies.
You need to add them if you use a plugin

* For all portal dialog plugins, we use: `react-hook-form` and `@floating-ui/react`
* `prismjs` is used only for the markdown editor
