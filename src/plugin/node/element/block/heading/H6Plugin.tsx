import {BlockElementPlugin} from "../../../../BlockElementPlugin";
import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {TagElement} from "../../../../IElementDef";


export type H6TagType = 'h6'
export type H6ElementType = TagElement & {
    tag: H6TagType
}

// noinspection JSUnusedGlobalSymbols
export class H6Plugin extends BlockElementPlugin {

    static readonly NAME: H6TagType = 'h6';


    render(props: RenderElementProps): React.ReactElement {

        return (
            <h6 {...props.attributes}>
                {props.children}
            </h6>
        )

    }


}
