import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {BooleanBlockElementPlugin} from "../../../../BooleanBlockElementPlugin";
import {TagElement} from "../../../../IElementDef";


export type H2Tag = 'h2'
export type H2Element = TagElement & {
    tag: H2Tag
}

// noinspection JSUnusedGlobalSymbols
export class H2Plugin extends BooleanBlockElementPlugin {

    static readonly NAME: H2Tag = 'h2';

    render(props: RenderElementProps): React.ReactElement {

        return (
            <h2 {...props.attributes}>
                {props.children}
            </h2>
        )

    }

}
