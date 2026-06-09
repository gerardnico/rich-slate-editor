import {BlockElementPlugin} from "../../../../BlockElementPlugin";
import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {Node as SlateNode} from "slate";
import {RichElement} from "../../../../RichElement";
import {TagElement} from "../../../../IElementDef";


export const CODE_LANG_LINE_TAG: TagCodeLineType = 'code-lang-line';
export type TagCodeLineType = 'code-lang-line'
export type CodeLineElement = TagElement & {
    tag: TagCodeLineType
    language: string
}

// noinspection JSUnusedGlobalSymbols
export class TagCodeLangLine extends BlockElementPlugin {


    getName(): string {
        return CODE_LANG_LINE_TAG;
    }


    isVoidElement(): boolean {
        return false;
    }

    render(props: RenderElementProps): React.JSX.Element {

        return (
            <div {...props.attributes} style={{position: 'relative'}}>
                {props.children}
            </div>
        )


    }

    static isCodeLineElement = (node: SlateNode) => {
        return RichElement.isTagElement(node) && node.tag === CODE_LANG_LINE_TAG
    }


}
