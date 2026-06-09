import {Range as SlateRange, Transforms} from "slate";
import {ReactEditor, useSelected} from "slate-react";
import React from "react";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {InlineElementPlugin} from "../../../../InlineElementPlugin";
import {InlineChromiumBugfix} from "../../../../../component/renderers/InlineChromiumBugfix";
import {TagElement} from "../../../../IElementDef";
import {RichSlate} from "../../../../../RichSlate";
import {AnchorLinkButton} from "./AnchorLinkButton";
import {AnchorLinkPortal} from "./AnchorLinkPortal.tsx";

export type AnchorLinkType = {
    url: URL
    title?: string
}
export type AnchorLinkTagType = 'a'
export type AnchorLinkElement = TagElement & AnchorLinkType & {
    tag: AnchorLinkTagType
}


// noinspection JSUnusedGlobalSymbols
export class AnchorLinkPlugin extends InlineElementPlugin {

    static TAG: AnchorLinkTagType = 'a';

    constructor(name: string, richSlate: RichSlate) {
        super(name, richSlate);

        /**
         * Add portal component
         */
        richSlate.addPortalComponents(this, [AnchorLinkPortal]);

        /**
         * Add button
         */
        richSlate.addToolbarButtons(this, [AnchorLinkButton])

        /**
         * Capture text insertion
         */
        const editor = richSlate.getSlateEditor();
        const {
            insertData,
            insertText,
        } = editor

        editor.insertText = (text: string) => {
            let url;
            try {
                url = new URL(text);
            } catch (e) {
                insertText(text)
                return;
            }
            this.createLink(editor, {url});
        }

        /**
         * Add a link it to a paste from clipboard
         */
        editor.insertData = data => {
            const text = data.getData('text/plain')
            if (text === "") {
                insertData(data)
                return;
            }
            let url;
            try {
                url = new URL(text);
            } catch (e) {
                insertData(data)
                return;
            }
            this.createLink(editor, {url})

        }

    }


    deleteLinksInSelection(editor: ReactEditor) {
        Transforms.unwrapNodes(editor, {
            match: n => this.isPluginElement(n)
        })
    }




    /**
     * Create a link by wrapping the selection
     *
     * There are two ways to add links.
     * You can either add a link via the toolbar icon above,
     * or if you want in on a little secret, copy a URL to your keyboard
     * and paste it while a range of text is selected.
     *
     * Check where wrap link is used to see how it works
     */
    createLink = (editor: ReactEditor, anchorLink: AnchorLinkType) => {

        if (this.isSelected(editor)) {
            this.deleteLinksInSelection(editor)
        }

        const {selection} = editor
        const isCollapsed = selection && SlateRange.isCollapsed(selection)
        let link: AnchorLinkElement = {
            tag: AnchorLinkPlugin.TAG,
            url: anchorLink.url,
            children: isCollapsed ? [
                {
                    text: anchorLink.url.toString()
                }
            ] : [],
        }

        if (anchorLink.title) {
            link = {
                title: anchorLink.title,
                ...link
            }
        }

        if (isCollapsed) {
            Transforms.insertNodes(editor, link)
        } else {
            Transforms.wrapNodes(editor, link, {split: true})
            Transforms.collapse(editor, {edge: 'end'})
        }
    }

    render({attributes, children, element}: RenderElementProps & { element: AnchorLinkElement }): React.JSX.Element {
        const selected = useSelected()

        let props: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
            title: `${element.title !== undefined ? element.title + ' ' : ''}(${element.url})`,
        }
        if (selected) {
            props = {
                style: {boxShadow: '0 0 0 3px #ddd'},
                ...props
            }
        }
        return (
            <a
                {...attributes}
                {...props}
                href={element.url.toString()}
            >
                <InlineChromiumBugfix/>
                {children}
                <InlineChromiumBugfix/>
            </a>
        )
    }

    /**
     * Update a link
     */
    updateLink = (editor: ReactEditor, newProperties: Partial<AnchorLinkElement>) => {


        const nodeEntry = this.getHighestNodeEntry(editor);
        if (nodeEntry === undefined) {
            return;
        }
        /**
         * Set new properties on Element at location
         */
        Transforms.setNodes<AnchorLinkElement>(
            editor,
            newProperties,
            {
                at: nodeEntry[1],
                match: n => this.isPluginElement(n)
            }
        );

    }

}
