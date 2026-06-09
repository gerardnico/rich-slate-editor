import {ElementPlugin} from "./ElementPlugin";
import {BaseElement} from "slate";


/**
 * Slate does not have a hierarchical node.
 * A node is an editor, an element and a text
 * That's why we extend from BaseElement and
 * not from a Node.
 */
export type TagElement = BaseElement & {
    tag: string
}

export type tagProperty = 'tag';

export const TAG_KEY_NAME: tagProperty = 'tag';

/**
 * The definition of an element
 */
export interface IElementDef {

    /**
     * The tag value
     */
    getName(): string

    /**
     * A void element does not wrap any node (text also)
     */
    isVoidElement(): boolean

    /**
     * A root element for the composite
     * (When deleting a composite element such as a list,
     * we need to unwrap up to the root element)
     */
    isRootElement(): boolean

    /**
     * An inline element can contain inline element but not block element
     * They are called content element in HTML
     *
     * Inline nodes cannot be the first or last child of a parent block, nor can they be next to another inline node in the children array.
     *
     * https://docs.slatejs.org/concepts/02-nodes#blocks-vs.-inlines
     */
    isInlineElement(): boolean

    /**
     * The plugin that handle this element
     */
    getPlugin(): ElementPlugin;

    /**
     * Void elements that accept marks like bold or italic
     */
    isMarkableVoid(): boolean;


}
