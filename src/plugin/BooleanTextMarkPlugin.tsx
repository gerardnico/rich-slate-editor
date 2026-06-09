import {BaseText, Editor} from "slate";
import React from "react";
import {TextMarkPlugin} from "./TextMarkPlugin";
import {ReactEditor} from "slate-react";
import {RichSlate} from "../RichSlate.tsx";
import {BooleanToolbarButton} from "./attribute/mark/BooleanToolbarButton.tsx";

/**
 * A Mark Plugin but for boolean attribute
 */
export abstract class BooleanTextMarkPlugin extends TextMarkPlugin {


    constructor(name: string, richSlate: RichSlate) {
        super(name, richSlate);

        richSlate.addToolbarButtons(this, [
                React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
                    (props, ref) =>
                        <BooleanToolbarButton ref={ref} booleanMarkPlugin={this} {...props}/>)
            ]
        )
    }

    /**
     * @param editor - the editor - note we could get the editor from the global {@link RichSlateEditor} object,
     * but we passed it as argument because this is the state that changed
     * when the content changed (Otherwise typescript is not happy)
     */
    isBooleanMarkActive = (editor: ReactEditor) => {
        /**
         * Return an object of marks at the current selection (key = marks name and value = mark value)
         */
        const marks = Editor.marks(editor)
        /**
         * If the value is true, return true
         */
        return marks ? marks[this.getName() as keyof Omit<BaseText, "text">] === true : false
    }


    /**
     * @param editor - the editor - note we could get the editor from the global {@link RichSlateEditor} object,
     * but we passed it as argument because this is the state that changed
     * when the content changed (Otherwise typescript is not happy)
     */
    toggleBooleanMark = (editor: ReactEditor) => {

        const isActive = this.isBooleanMarkActive(editor);

        if (isActive) {
            /**
             * If the selection is collapsed,
             * the mark is removed from the next characters
             */
            Editor.removeMark(editor, this.getName())
        } else {
            Editor.addMark(editor, this.getName(), true)
        }

    }

    /**
     * Return the rendering props for leaf
     * for property with only a key
     * (ie boolean attribute, the presence is true)
     */
    abstract getBooleanStylingProps(): React.HTMLAttributes<HTMLSpanElement>

    getStylingProps(value: string | boolean | null | undefined): React.HTMLAttributes<HTMLSpanElement> {
        if (value === null || value === true || value === undefined) {
            return this.getBooleanStylingProps();
        }
        throw new Error("The mark styling for (" + this.getName() + ") is not a boolean (value: " + value + ")")
    }

    getCommandIconName(): string {
        return "unknown";
    }


    /**
     * The hotkey to toggle
     */
    abstract getHotKey(): string;


}
