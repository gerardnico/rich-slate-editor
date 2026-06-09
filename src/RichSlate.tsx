import {RenderElementProps, RenderLeafProps} from "slate-react/dist/components/editable";
import {RichSlateBuilder} from "./RichSlateBuilder";
import {ElementPlugin} from "./plugin/ElementPlugin";
import {ErrorRenderer} from "./component/renderers/ErrorRenderer";
import React from "react";
import {BaseEditor, BaseText, createEditor, Descendant, Editor, Element as SlateElement} from "slate";
import {RichSlatePlugin} from "./plugin/RichSlatePlugin.tsx";
import {ParagraphElement, PElementPlugin} from "./plugin/node/element/block/paragraph/PElementPlugin";
import {ReactEditor, withReact} from "slate-react";
import {HistoryEditor, withHistory} from "slate-history";
import {BoldMark} from "./plugin/attribute/mark/BoldMarkPlugin.tsx";
import {TextMarkPlugin} from "./plugin/TextMarkPlugin";
import {AnchorLinkElement} from "./plugin/node/element/inline/link/AnchorLinkPlugin";
import {IElementDef, TagElement} from "./plugin/IElementDef";
import {RichElement} from "./plugin/RichElement";
import {ElementAttributePlugin} from "./plugin/ElementAttributePlugin";
import {StoragePlugin} from "./plugin/StoragePlugin.ts";
import {Objecty} from "@/lib/Objecty.ts";

/**
 * Custom element
 * We add our Element (ie TagElement)
 *
 * And we show a type discrimination (union types)
 * It allows to narrow a type.
 * ie if presented with code like if (node.tag === 'p') { ... } the inside of the block,
 * will narrow the type of node to ParagraphElement.
 */
type CustomElement = TagElement
    | (ParagraphElement | AnchorLinkElement);

/**
 * Module extension
 * Declaration of our element (ie tag element)
 * https://docs.slatejs.org/concepts/12-typescript
 * Example: [custom](https://github.com/ianstormtaylor/slate/blob/main/packages/slate-react/src/custom-types.ts)
 */
declare module 'slate' {

    interface CustomTypes {
        //Editor: CustomEditor
        Element: CustomElement
        /**
         * Text are leaf and are then used in
         * RenderLeafProps
         */
        Text: BaseText & BoldMark
    }
}

type RenderAttributeType = React.HTMLAttributes<HTMLElement> & RenderElementProps['attributes'];

export type RichSlateHandlerType<T> = {
    plugin: RichSlatePlugin,
    name: string,
    handler: ((input: T) => void)
}

export class RichSlate {

    private builder: RichSlateBuilder;
    readonly editor: (BaseEditor & ReactEditor & HistoryEditor);

    /**
     * All plugins
     */
    plugins = new Map<string, RichSlatePlugin>();

    /**
     * For Element Rendering: the plugins tags
     */
    tagElementDefs = new Map<string, IElementDef>();
    attributeElementPlugins = new Map<string, ElementAttributePlugin<any>>();

    /**
     * For Leaf rendering
     */
    leafPlugins = new Map<string, TextMarkPlugin>();

    /**
     * Storage plugins
     */
    storagePlugins = new Map<string, StoragePlugin>();

    /**
     * List of portal components
     */
    private readonly portalComponents = new Map<RichSlatePlugin, React.FC<React.HTMLAttributes<HTMLDivElement>>[]>();

    /**
     * For Handlers
     */
    private readonly onClickHandlers = new Map<RichSlatePlugin, ((event: React.MouseEvent) => void)>();
    private readonly onDoubleClickHandlers = new Map<RichSlatePlugin, ((event: React.MouseEvent) => void)>();
    private readonly onKeyDownHandlers = new Map<string, RichSlateHandlerType<React.KeyboardEvent>>();
    private readonly onDomBeforeInputHandlers = new Map<RichSlatePlugin, ((event: InputEvent) => void)>();
    private readonly onChangeHandlers = new Map<RichSlatePlugin | null, ((descendants: Descendant[]) => void)>();

    /**
     * For the toolbar menu
     * @private
     */
    private readonly menuToolBarButtons = new Map<RichSlatePlugin, React.FC<React.HTMLAttributes<HTMLButtonElement>>[]>();

    /**
     * Return an array of forwarded function components that can be used to create Element (in the type property)
     * for the toolbars.
     *
     * Because the button can be used in a dynamic menu, they need to pass the ref to position them
     */
    private readonly hoveringToolBarButtons = new Map<RichSlatePlugin, React.ForwardRefExoticComponent<React.PropsWithoutRef<React.HTMLAttributes<HTMLButtonElement>> & React.RefAttributes<HTMLButtonElement>>[]>();


    constructor(pluginBuilders: RichSlateBuilder) {

        this.builder = pluginBuilders;
        if (pluginBuilders.editor === undefined) {

            /**
             * React Editor should wrap History as stated here:
             * https://docs.slatejs.org/libraries/slate-react/with-react
             * In the examples, it's the other way around ???
             */
            this.editor = withReact(withHistory(createEditor()));

        } else {
            /**
             * used in test mostly to inject the state with hyperscript
             */
            this.editor = pluginBuilders.editor;
            /**
             * To avoid error: TypeError: editor.getChunkSize is not a function
             */
            if(this.editor.getChunkSize == undefined ){
                this.editor.getChunkSize = node => (Editor.isEditor(node) ? 1000 : null)
            }
        }


        for (const pluginBuilder of pluginBuilders.pluginBuilders.values()) {

            let plugin = pluginBuilder.build(this);
            this.plugins.set(plugin.getName(), plugin);

            /**
             * For rendering element and leaf
             * We create maps of tags, attribute plugin and text mark plugin
             */
            if (plugin instanceof ElementPlugin) {
                for (const tagDef of plugin.getElementDefinitions()) {
                    this.tagElementDefs.set(tagDef.getName(), tagDef);
                }
                continue;
            }
            if (plugin instanceof ElementAttributePlugin) {
                this.attributeElementPlugins.set(plugin.getName(), plugin)
                continue;
            }
            if (plugin instanceof TextMarkPlugin) {
                this.leafPlugins.set(plugin.getName(), plugin)
            }
            if (plugin instanceof StoragePlugin) {
                this.storagePlugins.set(plugin.getName(), plugin)
            }
        }


        /**
         * Mount
         */
        this.mountEditor();

    }

    /**
     *
     * @private change the editor behavioral function
     */
    private mountEditor() {

        const editor = this.getSlateEditor();

        /**
         * A void element does not wrap text
         */
        const {isVoid} = editor;
        editor.isVoid = (element: SlateElement) => {
            if (!RichElement.isTagElement(element)) {
                return isVoid(element);
            }
            const elementDef = this.tagElementDefs.get(element.tag);
            if (elementDef === undefined) {
                return isVoid(element);
            }
            if (elementDef.isVoidElement()) {
                return true;
            }
            return isVoid(element);
        }

        /**
         * Is inline
         */
        const {isInline} = editor;
        editor.isInline = (element: SlateElement) => {
            if (!RichElement.isTagElement(element)) {
                return isInline(element);
            }
            const elementDef = this.tagElementDefs.get(element.tag);
            if (elementDef === undefined) {
                return isInline(element);
            }
            if (elementDef.isInlineElement()) {
                return true;
            }
            return isInline(element);
        }

        /**
         * markable Void
         */
        const {markableVoid} = editor;
        editor.markableVoid = (element: SlateElement) => {
            if (!RichElement.isTagElement(element)) {
                return markableVoid(element);
            }
            const elementDef = this.tagElementDefs.get(element.tag);
            if (elementDef === undefined) {
                return markableVoid(element);
            }
            if (elementDef.isMarkableVoid()) {
                return true;
            }
            return markableVoid(element);
        }

    }


    /**
     * Render chunks of text inside different containers.
     * Define a rendering function based on the element passed to `props`. We use
     * `useCallback` here to memoize the function for subsequent renders.
     * (ie cache the function definition between re-renders)
     */
    renderElement = (props: RenderElementProps): React.ReactElement => {

        const {element, children} = props;

        let attributes = props.attributes as RenderAttributeType;

        let tag;
        if (!RichElement.isTagElement(element)) {
            return (
                <ErrorRenderer message={"The element has no tag attribute"} {...props}>
                    {children}
                </ErrorRenderer>
            )
        }
        tag = element.tag;
        for (const prop in element) {
            if (prop === "tag") {
                continue;
            }
            const attributePlugin = this.attributeElementPlugins.get(prop);
            if (attributePlugin === undefined) {
                continue;
            }
            const htmlAttributes = attributePlugin.render(props);
            attributes = Objecty.deepMerge(htmlAttributes, attributes) as RenderAttributeType;
        }

        const tagElement = this.tagElementDefs.get(tag);

        if (tagElement == undefined) {
            return (
                <ErrorRenderer message={`The tag (${tag}) does not have any rendering handler.`} {...props}>
                    {props.children}
                </ErrorRenderer>
            )
        }
        return tagElement.getPlugin().render({attributes, element, children});

    }

    /**
     * Leaf is the decorator
     * https://docs.slatejs.org/concepts/09-rendering#leaves
     *
     * For every format, you add, Slate will break up the text content into "leaves",
     * and you need to tell Slate how to render them
     *
     * Slate will automatically render all the children of a block for you,
     * and then pass them to you just like any other React component would, via props.children
     *
     * Slate passes attributes that should be rendered on the top-most element of your blocks,
     * so that you don't have to build them up yourself
     *
     * @param attributes
     * @param children
     * @param leaf
     * @constructor
     */
    renderLeaf({attributes, children, leaf}: RenderLeafProps) {

        let markPlugin;
        let spanProps: React.HTMLAttributes<HTMLSpanElement> = {};
        for (let property in leaf) {
            markPlugin = this.leafPlugins.get(property);
            if (markPlugin === undefined) {
                // mark may be used by other plugin for other purpose
                continue;
            }
            const value = leaf[property as keyof BaseText];
            const stylingProps = markPlugin.getStylingProps(value);
            spanProps = Objecty.deepMerge(spanProps, stylingProps);
        }
        /**
         * For prism
         */
        // const {text, ...rest} = leaf
        // let classNames = Object.keys(rest).join(' ');

        /**
         * It is described with a span because
         * all leaves must be an inline HTML element.
         */
        return (
            <span
                {...attributes}
                {...spanProps}
            >
          {children}
            </span>
        )
    }


    onKeyDown(event: React.KeyboardEvent) {

        for (const {plugin, handler, name} of this.onKeyDownHandlers.values()) {
            try {
                handler(event);
            } catch (e) {
                console.error(`Error on key down handler for plugin (${plugin.getName()}, handler ${name}`, e)
            }
            if (event.defaultPrevented) {
                return;
            }
        }

    }

    getSlateEditor() {
        return this.editor;
    }


    onClick(event: React.MouseEvent) {
        for (const [plugin, handlers] of this.onClickHandlers.entries()) {
            try {
                handlers(event);
            } catch (e) {
                console.error("Error on onClick handler for plugin (" + plugin.getName() + ")", e)
            }
            if (event.isDefaultPrevented()) {
                return;
            }
        }
    }

    /**
     * Return the plugin from a name
     * Used to get back a plugin object:
     * * in test
     * * in component via the context
     * @param name
     * @throws error if the plugin was not found
     */
    getPlugin<T extends RichSlatePlugin>(name: string): T {
        const elementPlugin = this.plugins.get(name) as T;
        if (elementPlugin === undefined) {
            throw new Error(`No plugin defined with the name ${name}`)
        }
        return elementPlugin;
    }

    onDomBeforeInput(event: InputEvent) {
        for (const [plugin, handler] of this.onDomBeforeInputHandlers.entries()) {
            try {
                handler(event);
            } catch (e) {
                console.error("Error on onDomBeforeInput handler for plugin (" + plugin.getName() + ")", e)
            }
            if (event.defaultPrevented) {
                return;
            }
        }
    }


    getHoveringToolbarButtons() {
        return this.hoveringToolBarButtons;
    }

    getMenuToolbarButtons() {
        return this.menuToolBarButtons;
    }

    getPluginPortalComponents() {
        return this.portalComponents;
    }

    addOnKeyDownHandler(richSlateHandler: RichSlateHandlerType<React.KeyboardEvent>) {
        const id = this.getRichSlateHandlerId(richSlateHandler);
        if (this.onKeyDownHandlers.has(id)) {
            throw new Error("The keydown handler (" + id + ") was already registered");
        }
        this.onKeyDownHandlers.set(id, richSlateHandler);
    }


    addPortalComponents(plugin: RichSlatePlugin, PortalComponents: React.FC<React.HTMLAttributes<HTMLDivElement>>[]) {
        this.portalComponents.set(plugin, PortalComponents)
    }

    deleteDoubleClickHandler(slatePlugin: RichSlatePlugin) {
        this.onDoubleClickHandlers.delete(slatePlugin)
    }

    addDoubleClickHandler(slatePlugin: RichSlatePlugin, handler: (event: React.MouseEvent) => void) {
        this.onDoubleClickHandlers.set(slatePlugin, handler);
    }

    onDoubleClick(event: React.MouseEvent) {
        for (const [plugin, handler] of this.onDoubleClickHandlers.entries()) {
            try {
                handler(event);
            } catch (e) {
                console.error("Error on double click handler for plugin (" + plugin.getName() + ")", e)
            }
            if (event.isDefaultPrevented()) {
                return;
            }
        }
    }

    addToolbarButtons(plugin: RichSlatePlugin, buttons: React.FC<React.HTMLAttributes<HTMLButtonElement>>[]) {
        this.menuToolBarButtons.set(plugin, buttons);
        return this;
    }

    /**
     * It's an event handler for the native DOM beforeinput event,
     * because sadly React's synthetic events don't properly expose it.
     * In this case it's listening for specific inputTypes that browsers fire for context menus, etc.
     *
     * For name of input type, see the playground here:
     * https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType
     *
     */
    addOnDownBeforeInputHandler(plugin: RichSlatePlugin, handler: ((event: InputEvent) => void)) {
        this.onDomBeforeInputHandlers.set(plugin, handler);
    }

    addHoveringToolbarButton(plugin: RichSlatePlugin, Buttons: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.HTMLAttributes<HTMLButtonElement>> & React.RefAttributes<HTMLButtonElement>>[]) {
        this.hoveringToolBarButtons.set(plugin, Buttons);
    }

    deleteOnKeyDownHandler(richSlateHandler: RichSlateHandlerType<React.KeyboardEvent>) {
        this.onKeyDownHandlers.delete(this.getRichSlateHandlerId(richSlateHandler));
    }

    /**
     * onChange event of slate
     * It is fired for changes on the document structure but also for changes on the selection
     * onDocumentChange and onSelectionChange
     * https://github.com/ianstormtaylor/slate/issues/4687
     * @param plugin - the plugin
     * @param handler - the handler
     */
    addOnChangeHandler(plugin: RichSlatePlugin | null, handler: (descendant: Descendant[]) => void) {
        this.onChangeHandlers.set(plugin, handler);
    }


    deleteOnChangeHandler(plugin: RichSlatePlugin) {
        this.onChangeHandlers.delete(plugin);
    }

    onChange(descendants: Descendant[]) {

        for (const [plugin, handler] of this.onChangeHandlers.entries()) {
            try {
                handler(descendants);
            } catch (e) {
                console.error("Error on change handler for (" + (plugin !== null ? 'plugin' + plugin.getName() : 'element onChange function') + ")", e)
            }
        }
    }

    /**
     * The unique name identifier of the slate instance
     */
    getName() {
        return this.builder.name;
    }

    /**
     * Return the initial value
     */
    getInitialValue() {

        /**
         * Normally one storage plugin but who knows
         */
        for (const storagePlugin of this.storagePlugins.values()) {
            const descendants = storagePlugin.retrieve();
            if (descendants) {
                return descendants
            }
        }

        /**
         * Initial value that was fetched for a form for instance.
         */
        if (this.builder.initialValue !== null) {
            return this.builder.initialValue
        }

        /**
         * Empty Paragraph
         */
        return [
            {
                tag: PElementPlugin.PARAGRAPH_TAG,
                children: [
                    {
                        text: ''
                    }
                ],
            }
            ,
        ];
    }

    private getRichSlateHandlerId(richSlateHandler: RichSlateHandlerType<any>) {
        return richSlateHandler.plugin.getName() + "-" + richSlateHandler.name
    }
}
