import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {TagElement} from "../../../../IElementDef";
import {BooleanBlockElementPlugin} from "../../../../BooleanBlockElementPlugin";


export type H4TagType = 'h4'
export type H4ElementType = TagElement & {
    tag: H4TagType
}

// noinspection JSUnusedGlobalSymbols
export class H4Plugin extends BooleanBlockElementPlugin {

    static readonly NAME: H4TagType = 'h4';

    render(props: RenderElementProps): React.ReactElement {

        return (
            <h4 {...props.attributes}>
                {props.children}
            </h4>
        )

    }


}
