import {EditorInterface} from "slate/dist/interfaces/editor";
import React from "react";
import {BooleanTextMarkPlugin} from "../../BooleanTextMarkPlugin";
import isHotkey from "is-hotkey";
import {RichSlate} from "@/RichSlate.tsx";
import {BooleanToolbarButton} from "./BooleanToolbarButton.tsx";

export interface BoldSlateEditor extends EditorInterface {
    toggleBoldMark: () => void;
}

export interface BoldMark {
    bold?: boolean,
}

// noinspection JSUnusedGlobalSymbols
const boldHotkey = 'mod+b';

export class BoldMarkPlugin extends BooleanTextMarkPlugin {

    getHotKey(): string {
        return boldHotkey;
    }

    static NAME: string = 'bold';


    constructor(name: string, richSlate: RichSlate) {
        super(name, richSlate);

        richSlate.addHoveringToolbarButton(this, [
            React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
                (props, ref) =>
                    <BooleanToolbarButton ref={ref} booleanMarkPlugin={this} {...props}/>
            )
        ])

        richSlate.addOnKeyDownHandler({
            plugin: this,
            name: 'default',
            handler: (event: React.KeyboardEvent) => {
                if (!isHotkey(boldHotkey, event)) {
                    return;
                }
                event.preventDefault()
                this.toggleBooleanMark(this.getSlateEditor())
            }
        })

        richSlate.addOnDownBeforeInputHandler(this, (event: InputEvent) => {
            if (event.inputType !== 'formatBold') {
                return;
            }
            event.preventDefault()
            this.toggleBooleanMark(this.getSlateEditor())
        })
    }


    getBooleanStylingProps(): React.HTMLAttributes<HTMLSpanElement> {
        return {
            style: {
                fontWeight: 'bold'
            }
        };
    }


    getCommandIconName(): string {
        return "bold";
    }

}
