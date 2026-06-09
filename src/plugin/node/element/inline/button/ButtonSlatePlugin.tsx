import {RenderElementProps} from "slate-react";
import {InlineElementPlugin} from "../../../../InlineElementPlugin";
import {ReactElement} from "react";

import {InlineChromiumBugfix} from "../../../../../component/renderers/InlineChromiumBugfix";
import {RichSlate} from "../../../../../RichSlate.tsx";
import {ElementDefBuilder} from "../../../../ElementDefBuilder.ts";
import styles from "./button-slate.module.css";

/**
 * Hack between type and value
 */
type buttonType = 'button';
export type ButtonElement = {
    tag: buttonType
}
const BUTTON_TAG: buttonType = 'button';


// noinspection JSUnusedGlobalSymbols
export class ButtonSlatePlugin extends InlineElementPlugin {


    constructor(name: string, richSlate: RichSlate, elementDefSet: () => ElementDefBuilder[]) {
        super(name, richSlate, elementDefSet);
        const editor = richSlate.getSlateEditor();
        const {
            isElementReadOnly,
            isSelectable,
        } = editor

        editor.isElementReadOnly = element => this.isPluginElement(element) || isElementReadOnly(element)

        editor.isSelectable = element => this.isPluginElement(element) || isSelectable(element)
    }

    /**
     * Editable button (ie button in a contenteditable box)
     */
    render({attributes, children, element}: RenderElementProps): ReactElement {
        /*
              Note that this is not a true button, but a span with button-like CSS.
              True buttons are display:inline-block, but Chrome and Safari
              have a bad bug with display:inline-block inside contenteditable:
              - https://bugs.webkit.org/show_bug.cgi?id=105898
              - https://bugs.chromium.org/p/chromium/issues/detail?id=1088403
              Worse, one cannot override the display property: https://github.com/w3c/csswg-drafts/issues/3226
              The only current workaround is to emulate the appearance of a display:inline button using CSS.
            */
        return (
            <span
                {...attributes}
                onClick={ev => ev.preventDefault()}
                // Margin is necessary to clearly show the cursor adjacent to the button
                className={styles.buttonSlate}
            >
                <InlineChromiumBugfix/>
                {children}
                <InlineChromiumBugfix/>
                </span>
        )

    }


    getName(): string {
        return BUTTON_TAG;
    }




}
