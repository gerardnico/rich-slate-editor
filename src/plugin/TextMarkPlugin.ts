import {BaseText, Editor} from "slate";
import React from "react";
import {RichSlatePlugin} from "./RichSlatePlugin.tsx";
import {CustomSlateEditorType} from "../CustomSlateEditor";

/**
 * Mark Plugin
 * A mark is a property with a single value that is applied to a leaf text node
 * It just returns a styling property
 * Slate will split the text node accordingly
 * For Boolean mark such as bold, italic, ...
 * See {@link BooleanTextMarkPlugin}
 */
export abstract class TextMarkPlugin extends RichSlatePlugin {


    /**
     * Custom properties of text node are called marks.
     * https://docs.slatejs.org/api/nodes/editor#mark-methods
     */
    isMarkActive = (editor: Editor, keyValue: string) => {
        const marks = Editor.marks(editor)
        return marks ? marks[this.getName() as keyof Omit<BaseText, "text">] === keyValue : false
    }


    toggleMark = (editor: CustomSlateEditorType, value: string) => {

        const isActive = this.isMarkActive(editor, value);
        if (isActive) {
            Editor.removeMark(editor, this.getName())
        } else {
            Editor.addMark(editor, this.getName(), value)
        }

    }

    abstract getStylingProps(value: string | boolean | null | undefined): React.HTMLAttributes<HTMLSpanElement>;

    getCommandIconName(): string {
        return "image";
    }


}
