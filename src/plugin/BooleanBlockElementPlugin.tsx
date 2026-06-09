import {BlockElementPlugin} from "./BlockElementPlugin";
import React from "react";
import {Editor, Transforms} from "slate";
import {TagElement} from "./IElementDef";
import {PElementPlugin} from "./node/element/block/paragraph/PElementPlugin";
import {RichSlate} from "../RichSlate.tsx";
import {BooleanBlockToolbarButton} from "./node/element/block/BooleanBlockToolbarButton.tsx";

/**
 * One off element that goes from the tag to a paragraph tag
 * (ie without mandatory attribute)
 * Example: H1, H2, Blockquote
 */
export abstract class BooleanBlockElementPlugin extends BlockElementPlugin {


    constructor(name: string, richSlate: RichSlate) {
        super(name, richSlate);

        richSlate.addToolbarButtons(this, [
            React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
                (props, ref) =>
                    <BooleanBlockToolbarButton ref={ref} booleanBockPlugin={this} {...props}/>
            )
        ])
    }

    /**
     * Transform:
     * * a paragraph in a tag element block
     * * a tag element block in a paragraph
     * Editor is mandatory because this is the React state object for re-render
     */
    toggle = (editor: Editor) => {

        const isSelected = this.isSelected(editor);
        const newProperties = {
            tag: isSelected ? PElementPlugin.PARAGRAPH_TAG : this.getName(),
        }
        /**
         * Set new properties on Element at location
         */
        Transforms.setNodes<TagElement>(editor, newProperties);

    }


    getIcon(): string {
        return this.getName();
    }



}
