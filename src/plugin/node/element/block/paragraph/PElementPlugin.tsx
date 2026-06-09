import {BlockElementPlugin} from "../../../../BlockElementPlugin";
import {ElementPlugin} from "../../../../ElementPlugin";
import {Node} from "slate";
import {JSX} from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {RichElement} from "../../../../RichElement";


export type ParagraphTagType = 'p'
export type ParagraphElement = ElementPlugin & {
    tag: ParagraphTagType
}

// noinspection JSUnusedGlobalSymbols
export class PElementPlugin extends BlockElementPlugin {

    static readonly PARAGRAPH_TAG: ParagraphTagType = 'p';


    static isParagraphElement = (node: Node) => {
        return RichElement.isTagElement(node) && node.tag === PElementPlugin.PARAGRAPH_TAG
    }

    render({attributes, children}: RenderElementProps): JSX.Element {
        return <p {...attributes}>{children}</p>
    }


}
