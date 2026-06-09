import {BlockElementPlugin} from "../../../../BlockElementPlugin";
import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {TagElement} from "../../../../IElementDef";

const BLOCKQUOTE_TAG: BlockquoteCodeTagType = 'blockquote';
export type BlockquoteCodeTagType = 'blockquote'
export type BlockquoteElement = TagElement & {
    tag: BlockquoteCodeTagType
}

// noinspection JSUnusedGlobalSymbols
export class BlockquoteElementPlugin extends BlockElementPlugin {


    getName(): string {
        return BLOCKQUOTE_TAG;
    }


    isVoidElement(): boolean {
        return false;
    }

    render(props: RenderElementProps): React.JSX.Element {

        return (
            <blockquote {...props.attributes}>
                {props.children}
            </blockquote>
        )

    }


}
