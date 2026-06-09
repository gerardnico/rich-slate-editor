import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {BooleanBlockElementPlugin} from "../../../../BooleanBlockElementPlugin";
import {TagElement} from "../../../../IElementDef";


export type H1Tag = 'h1'
export type H1Element = TagElement & {
    tag: H1Tag
}


export class H1Plugin extends BooleanBlockElementPlugin {

    static readonly NAME: H1Tag = 'h1';


    render(props: RenderElementProps): React.ReactElement {

        return (
            <h1 {...props.attributes}>
                {props.children}
            </h1>
        )

    }


}
