import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {TagElement} from "../../../../IElementDef";
import {BooleanBlockElementPlugin} from "../../../../BooleanBlockElementPlugin";

export type H3TagType = 'h3'
export type H3ElementType = TagElement & {
    tag: H3TagType
}

// noinspection JSUnusedGlobalSymbols
export class H3Plugin extends BooleanBlockElementPlugin {

    static NAME: H3TagType = 'h3';


    render(props: RenderElementProps): React.ReactElement {

        return (
            <h3 {...props.attributes}>
                {props.children}
            </h3>
        )

    }


}
