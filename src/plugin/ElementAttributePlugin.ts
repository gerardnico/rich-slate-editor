import {Editor, Element as SlateElement, Node, Transforms} from "slate";
import {RichSlatePlugin} from "./RichSlatePlugin.tsx";
import {RenderElementProps} from "slate-react/dist/components/editable";
import React from "react";
import {ReactEditor} from "slate-react";

/**
 * Scalar Attribute Plugin
 * Example: align may have several values
 */
export abstract class ElementAttributePlugin<T> extends RichSlatePlugin {


    /**
     * Return the new property for the block
     * @param value - the value
     */
    abstract getNewProperties(value: string): Partial<T>;

    isAttributeValueActive(editor: Editor, value: string) {

        const {selection} = editor
        if (!selection) return false

        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: n =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    n[this.getName() as keyof Node] === value,
            })
        )

        return !!match
    }

    /**
     * Return if an attribute is present in the current selection
     * @param editor
     */
    isAttributeActive = (editor: Editor) => {
        const {selection} = editor
        if (!selection) return false

        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: n =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    this.getName() in n,
            })
        )

        return !!match
    }

    getSelectedAttributeValue(editor: ReactEditor): string | undefined {
        const {selection} = editor
        if (!selection) return undefined;

        const [nodeEntry] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: n =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    this.getName() in n,
            })
        )
        if (!nodeEntry) {
            return undefined;
        }
        const [node] = nodeEntry;
        return node[this.getName() as keyof Node];
    }

    setProperty = (editor: Editor, value: string) => {

        let newProperties: Partial<SlateElement> = this.getNewProperties(value)
        Transforms.setNodes<SlateElement>(editor, newProperties)

    }

    unsetProperty = (editor: Editor) => {

        Transforms.unsetNodes<SlateElement>(editor, this.getName())

    }


    /**
     * Rendering an attribute means:
     * * returning an HTML attributes object
     * * or modifying the attributes argument objects
     *
     * @param attributes - the HTML rendering attributes
     * @param children - the children
     * @param element - the element
     */
    abstract render({attributes, children, element}: RenderElementProps): React.HTMLAttributes<HTMLElement> ;

}
