/**
 * Extension of {@link Element} with custom static utility function
 * Static Element in Idea are not to refactor
 * We just extends the Slate Element with built-in
 * We use RichElement as Rich is our prefix (ie RichSlateEditor, RichElement, ...)
 */
import {Editor, Element, Element as SlateElement, Node} from 'slate'
import {TAG_KEY_NAME, TagElement} from "./IElementDef";


export const RichElement = {
    ...SlateElement,
    isTagElement(node: Node): node is TagElement {
        return !Editor.isEditor(node) && Element.isElement(node) && (TAG_KEY_NAME in node);
    }
}
