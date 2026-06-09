import {ReactEditor, useSelected} from "slate-react";
import {InlineElementPlugin} from "../../../../InlineElementPlugin";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {css} from "@emotion/css";
import React from "react";
import {InlineChromiumBugfix} from "@/component/renderers/InlineChromiumBugfix.tsx";

/**
 * Hack between type and value
 */
type BadgeType = 'badge';
export type BadgeElement = {
    tag: BadgeType
}
const BADGE_TAG: BadgeType = 'badge';


// noinspection JSUnusedGlobalSymbols
export class BadgeSlatePlugin extends InlineElementPlugin {

    isVoidElement(): boolean {
        return true;
    }

    getName(): string {
        return BADGE_TAG;
    }


    initEditor<T extends ReactEditor>(editor: T): T {

        const {
            isElementReadOnly,
            isSelectable,
        } = editor

        editor.isElementReadOnly = element => this.isTagElement(element) || isElementReadOnly(element)

        editor.isSelectable = element => this.isTagElement(element) || isSelectable(element)

        return editor;
    }

    render({attributes, children}: RenderElementProps) {
        const selected = useSelected()
        // @ts-ignore
        return (
            <span
                {...attributes}
                contentEditable={false}
                className={css`
                    background-color: green;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 2px;
                    font-size: 0.9em;
                    ${selected && 'box-shadow: 0 0 0 3px #ddd;'}
                `}
                data-playwright-selected={selected}
            >
            <InlineChromiumBugfix/>
                {children}
                <InlineChromiumBugfix/>
            </span>
        )
    }


}
