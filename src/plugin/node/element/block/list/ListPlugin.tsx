import {BlockElementPlugin} from "../../../../BlockElementPlugin";
import {ElementPlugin} from "../../../../ElementPlugin";
import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {Editor, Element as SlateElement, Location, Point, Range, Transforms} from "slate";
import {RichSlate} from "@/RichSlate.tsx";
import {PElementPlugin} from "../paragraph/PElementPlugin";
import {ElementDefBuilder} from "../../../../ElementDefBuilder";
import {ReactEditor} from "slate-react";
import {ListTagButton} from "./ListTagButton";


export type BulletListTag = 'ul'
export type BulletListElementType = ElementPlugin & {
    tag: BulletListTag
}

export type OrderedListTag = 'ol'
export type OrderedListElementType = ElementPlugin & {
    tag: OrderedListTag
}

export type ListItemTagType = 'li'
export type ParagraphElementType = ElementPlugin & {
    tag: ListItemTagType
}

export type ListTypeTag = OrderedListTag | BulletListTag;

export class ListPlugin extends BlockElementPlugin {

    static readonly NAME = 'list';
    static readonly UL: BulletListTag = 'ul';
    static readonly OL: OrderedListTag = 'ol';
    static readonly LI: ListItemTagType = 'li';


    constructor(name: string, richSlate: RichSlate) {
        super(name, richSlate, () => {
            const tagSet: ElementDefBuilder[] = [];
            for (const tag of [ListPlugin.UL, ListPlugin.OL, ListPlugin.LI]) {
                let elementBuilder = new ElementDefBuilder(tag)
                    .setIsInline(false);
                if (tag === ListPlugin.LI) {
                    elementBuilder.setIsRoot(false);
                }
                tagSet.push(elementBuilder);
            }
            return tagSet;
        });

        /**
         * Buttons
         */
        richSlate.addToolbarButtons(this,
            [ListPlugin.UL, ListPlugin.OL].map(tag =>
                React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
                    (props: React.HTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) =>
                        <ListTagButton tag={tag} ref={ref} {...props}/>
                ))
        )

        /**
         * Deleting backward at the beginning of a list item
         * transform a list-item into a paragraph
         */
        let editor = richSlate.getSlateEditor();
        const {deleteBackward} = editor;

        editor.deleteBackward = (...args) => {
            const {selection} = editor

            if (!(selection && Range.isCollapsed(selection))) {
                deleteBackward(...args)
                return;
            }
            const listItemNodeEntry = Editor.above(editor, {
                match: () => this.isSelectedTag(editor, ListPlugin.LI),
            })
            if (!listItemNodeEntry) {
                deleteBackward(...args)
                return;
            }
            const path = listItemNodeEntry[1];
            const start = Editor.start(editor, path)
            if (!Point.equals(selection.anchor, start)) {
                deleteBackward(...args)
                return
            }
            this.deleteListItem(editor, path)

        }

    }


    render({attributes, children, element}: RenderElementProps): React.ReactElement {
        switch (element.tag) {
            case ListPlugin.UL: {
                return (
                    <ul {...attributes}>
                        {children}
                    </ul>
                )
            }
            case ListPlugin.OL: {
                return (
                    <ol {...attributes}>
                        {children}
                    </ol>
                )
            }
            case ListPlugin.LI: {
                return (
                    <li {...attributes}>
                        {children}
                    </li>
                )
            }
        }
        return <p>Internal Render error: the tag ({element.tag}) is not a list tag</p>

    }

    createList(editor: ReactEditor, listTagType: BulletListTag | OrderedListTag) {

        /**
         * Change the current selected element to LI
         */
        let newProperties: Partial<SlateElement> = {
            tag: ListPlugin.LI
        }
        Transforms.setNodes(editor, newProperties)

        /**
         * Wrap them
         */
        const block = {tag: listTagType, children: []}
        Transforms.wrapNodes(editor, block)

    }


    /**
     * To delete a whole list, you need to select the items
     * @param editor
     * @param at - the known location otherwise the editor selection
     */
    deleteListItem(editor: ReactEditor, at?: Location) {

        /**
         * Unwrap the nodes at a location from a parent node,
         * splitting the parent if necessary to ensure that only the content in the range is unwrapped.
         * The element needs to have a parent otherwise you get an empty array
         */
        Transforms.unwrapNodes(editor, {
            match: n => this.isPluginRootElement(n),
            at: at,
            split: true,
        })

        /**
         * Change the current block
         * (as paragraph if active or list item if not)
         *
         * The list-item block is unwrapped.
         * The current location should be the unwrapped block
         * but
         */
        let newProperties: Partial<SlateElement> = {
            tag: PElementPlugin.PARAGRAPH_TAG
        }
        Transforms.setNodes(editor, newProperties, {
            // without this match, it may set the properties on the text node
            match: n => this.isTagElement(n)
        })


    }


}
