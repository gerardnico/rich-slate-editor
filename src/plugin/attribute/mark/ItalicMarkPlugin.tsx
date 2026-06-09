import React from "react";
import {BooleanTextMarkPlugin} from "../../BooleanTextMarkPlugin";
import isHotkey from "is-hotkey";
import {RichSlate} from "../../../RichSlate.tsx";
import {BooleanToolbarButton} from "./BooleanToolbarButton.tsx";


export interface ItalicAttribute {
    italic?: boolean,
}

const italicHotkey = 'mod+i';

// noinspection JSUnusedGlobalSymbols
export class ItalicMarkPlugin extends BooleanTextMarkPlugin {


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
            handler:
                (event: React.KeyboardEvent): void => {
                    {
                        if (!isHotkey(italicHotkey, event)) {
                            return;
                        }
                        event.preventDefault()
                        this.toggleBooleanMark(this.getSlateEditor())
                    }
                }
        })

        richSlate.addOnDownBeforeInputHandler(this, (event: InputEvent) => {
            if (event.inputType !== 'formatItalic') {
                return;
            }
            event.preventDefault()
            this.toggleBooleanMark(this.getSlateEditor())
        })
    }

    getHotKey(): string {
        return italicHotkey
    }


    static readonly NAME = 'italic';


    getBooleanStylingProps(): React.HTMLAttributes<HTMLSpanElement> {

        return {
            style: {
                fontStyle: 'italic'
            }
        };

    }


    getCommandIconName(): string {
        return "italic";
    }

}
