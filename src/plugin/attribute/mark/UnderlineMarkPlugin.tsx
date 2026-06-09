import React from "react";
import {BooleanTextMarkPlugin} from "../../BooleanTextMarkPlugin";
import isHotkey from "is-hotkey";
import {RichSlate} from "../../../RichSlate";
import {BooleanToolbarButton} from "./BooleanToolbarButton.tsx";


export interface UnderlineAttribute {
    underline?: boolean,
}

// noinspection JSUnusedGlobalSymbols
const underlineHotkey = 'mod+u';

export class UnderlineMarkPlugin extends BooleanTextMarkPlugin {

    static readonly NAME = 'underline';

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
                if (!isHotkey(underlineHotkey, event)) {
                    return;
                }
                event.preventDefault()
                this.toggleBooleanMark(this.getSlateEditor())
            }
        })

        richSlate.addOnDownBeforeInputHandler(this, (event: InputEvent) => {
                if (event.inputType !== 'formatUnderline') {
                    return;
                }
                event.preventDefault()
                this.toggleBooleanMark(this.getSlateEditor())
            }
        )
    }


    getBooleanStylingProps(): React.HTMLAttributes<HTMLSpanElement> {

        return {
            style: {
                textDecoration: 'underline'
            }
        };

    }


    getCommandIconName(): string {
        return "underline";
    }


    getHotKey(): string {
        return underlineHotkey;
    }

}
