import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {TagElement} from "../../../../IElementDef";
import {BooleanBlockElementPlugin} from "../../../../BooleanBlockElementPlugin";


export type H5TagType = 'h5'
export type H5ElementType = TagElement & {
    tag: H5TagType
}

// noinspection JSUnusedGlobalSymbols
export class H5Plugin extends BooleanBlockElementPlugin {

    static readonly NAME: H5TagType = 'h5';

    render(props: RenderElementProps): React.ReactElement {

        return (
            <h5 {...props.attributes}>
                {props.children}
            </h5>
        )

    }


}
