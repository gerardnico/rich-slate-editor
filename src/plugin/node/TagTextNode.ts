import {TextMarkPlugin} from "../TextMarkPlugin";
import {RenderLeafProps} from "slate-react/dist/components/editable";
import React from "react";


/**
 * Hack between type and value
 */
type TextNodeType = 'text';
export const TEXT_TAG: TextNodeType = 'text';

export interface TagTextNodeType {
    tag: TextNodeType,
    text: string
}

/**
 * Leaf contains the document's text.
 * Equivalent to text node in the DOM
 *
 * Text node
 * Text nodes are the lowest-level nodes in the tree,
 * containing the text content of the document, along with any formatting.
 * https://docs.slatejs.org/concepts/02-nodes#text
 * These custom properties are sometimes called marks.
 * https://docs.slatejs.org/api/nodes/editor#mark-methods
 */
// noinspection JSUnusedGlobalSymbols
export abstract class TagTextNode extends TextMarkPlugin {

    getName(): string {
        return TEXT_TAG;
    }

    static toTextNode = (content: string): TagTextNodeType[] => [{
        tag: TEXT_TAG,
        text: content
    }]

    abstract rendering({attributes, children, text}: RenderLeafProps): React.ReactElement;

}
