import {ReactEditor} from "slate-react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import React from "react";
import {RichSlatePlugin} from "./RichSlatePlugin.tsx";
import {IElementDef, TagElement} from "./IElementDef";
import {RichSlate} from "../RichSlate";
import {BaseEditor, Editor, Element as SlateElement, Node as SlateNode, NodeEntry} from "slate";
import {ElementDefBuilder} from "./ElementDefBuilder";


/**
 * A plugin that manages our slate Element called the tag element.
 * Generally, a plugin handles:
 * * one single element (h1, anchor link)
 * * multiple/composed elements (list, table)
 *
 *
 * An element may be added:
 * * without attributes (blockquote does not any)
 * * other with (link needs a URL)
 *
 * There is a boolean logic when the element does not have any attribute (ie h1,...)
 *
 * A node in Slate is a union of three type (Editor, Element and Text)
 * (We can't therefore extend a single node type, we extend the plugin)
 */
export abstract class ElementPlugin extends RichSlatePlugin {


    /**
     * The elements managed by plugins
     * Most plugin manage only one tag (ie scalar) but complex plugin
     * such as list and table may manage more
     * @private
     */
    private readonly elementDefs = new Map<string, IElementDef>;

    /**
     *
     * @param name - unique plugin name
     * @param richSlate - the rich slate plugin controller
     * @param elementDefSet - the element set def of each tag that the plugin manages
     */
    protected constructor(name: string, richSlate: RichSlate, elementDefSet: (() => ElementDefBuilder[])) {
        super(name, richSlate);

        /**
         * We build later because `this` should be used after `super`
         */
        for (const elementDefBuilder of elementDefSet()) {
            const elementDef = elementDefBuilder.build(this);
            this.elementDefs.set(elementDef.getName(), elementDef);
        }

    }


    /**
     * An element plugin may be a scalar or composite (ie manipulate more than one element tag)
     * For instance:
     * * a list has a type (ol, ul) and list of item (li)
     * * a table
     * * ...
     */
    getElementDefinitions(): IElementDef[] {
        return [...this.elementDefs.values()];
    }


    /**
     * Render
     * @param attributes
     * @param children
     * @param element - the slate element
     */
    abstract render({attributes, children, element}: RenderElementProps): React.ReactElement;

    /**
     * Determine whether any of the current selection elements contains of the plugin tags
     * We don't use `active` as active is an HTML word that design the element that has focus.
     * @param editor - the editor
     */
    isSelected = (editor: Editor) => {

        const {selection} = editor
        if (!selection) return false

        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: n => this.isPluginElement(n),
            })
        )
        return !!match

    }

    /**
     * Determine if the plugin element with the specified tag is selected
     * @param editor - the editor
     * @param tag - the tag name
     */
    isSelectedTag = (editor: ReactEditor, tag: string) => {

        const {selection} = editor
        if (!selection) return false

        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: n => this.isPluginTagElement(n, tag)
            })
        )
        return !!match

    }

    /**
     * Return the highest node entry in the selection
     * (index 0 is the element, index 1 is the path)
     * @param editor
     */
    getHighestNodeEntry<T extends TagElement>(editor: BaseEditor): NodeEntry<T> | undefined {

        /**
         * Return a node entry
         * https://docs.slatejs.org/api/nodes/node-entry
         */
        const [nodeEntry] = Editor.nodes(editor, {
            match: n => this.isPluginElement(n),
            mode: "highest"
        })
        if (nodeEntry === undefined) {
            return undefined;
        }
        return nodeEntry as NodeEntry<T>;

    }

    /**
     * Return if the node is an element managed by this plugin
     * @param n - the node
     */
    isPluginElement(n: SlateNode) {
        return this.isTagElement(n) &&
            this.elementDefs.has(n.tag)
    }

    isPluginTagElement(n: SlateNode, tag: string) {
        return this.isTagElement(n) &&
            this.elementDefs.has(n.tag) &&
            n.tag === tag;
    }

    isPluginRootElement(n: SlateNode) {
        if (!this.isTagElement(n)) {
            return false;
        }
        const element = this.elementDefs.get(n.tag);
        if (element === undefined) {
            return false;
        }
        return element.isRootElement()
    }

    isTagElement(n: SlateNode): n is TagElement {
        return !Editor.isEditor(n) && SlateElement.isElement(n);
    }


}
