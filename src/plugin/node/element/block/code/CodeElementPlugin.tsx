import {BlockElementPlugin} from "../../../../BlockElementPlugin";
import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {Node as SlateNode} from "slate";
import {RichElement} from "../../../../RichElement";
import {TagElement} from "../../../../IElementDef";

const CODE_TAG: CodeTagType = 'code';
export type CodeTagType = 'code'
export type CodeElement = TagElement & {
    tag: CodeTagType
}

// noinspection JSUnusedGlobalSymbols
export class CodeElementPlugin extends BlockElementPlugin {


    getName(): string {
        return CODE_TAG;
    }


    isVoidElement(): boolean {
        return false;
    }

    render(props: RenderElementProps): React.ReactElement {

        return (
            <pre {...props.attributes}>
                <code>{props.children}</code>
            </pre>
        )

    }

    static isCodeElement = (node: SlateNode) => {
        return RichElement.isTagElement(node) && node.tag === CODE_TAG
    }

}
