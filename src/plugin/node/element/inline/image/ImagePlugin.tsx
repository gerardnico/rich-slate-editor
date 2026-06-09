import {Editor, Location, Transforms} from "slate";
import React from "react";

import {ReactEditor, useFocused, useSelected, useSlateStatic} from "slate-react";
import {RichSlateToolbarIconButton} from "@/component/toolbars/RichSlateToolbarIconButton.tsx";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {InlineElementPlugin} from "../../../../InlineElementPlugin.ts";
import {RichSlate} from "@/RichSlate.tsx";
import styles from "./image.module.css"
import {TagElement} from "../../../../IElementDef.ts";
import {ElementDefBuilder} from "../../../../ElementDefBuilder.ts";
import {Imgy} from "@/lib/Imgy.ts";

export type ImageAttributes = {
    url: URL
    alt: string
}
type ImageTagType = 'img';
export type ImageElement = TagElement & {
    tag: ImageTagType
} & ImageAttributes


// noinspection JSUnusedGlobalSymbols
export class ImagePlugin extends InlineElementPlugin {

    static NAME: ImageTagType = 'img';


    constructor(name: string, richSlate: RichSlate) {
        super(name, richSlate, () => {
            return [new ElementDefBuilder(ImagePlugin.NAME)
                .setIsInline(true)
                .setIsVoid(true)
            ]
        });

        const editor = richSlate.getSlateEditor();
        const {insertData} = editor as ReactEditor

        /**
         * Image Insertion via Insert Data (Paste/Drag and Drop)
         * @param data
         */
        editor.insertData = (data: DataTransfer) => {

            const {files} = data

            if (files && files.length > 0) {
                for (const file of files) {
                    const reader = new FileReader()
                    const [mime] = file.type.split('/')

                    if (mime === 'image') {
                        reader.addEventListener('load', () => {
                            const url = reader.result
                            // @ts-ignore
                            this.insertImageNode(editor, url)
                        })
                        reader.readAsDataURL(file)
                        // to continue
                        return;
                    }
                }
            }

            /**
             * Image URL?
             */
            const text = data.getData('text/plain')
            let url;
            try {
                url = new URL(text);
            } catch (e) {
                // not an url
                insertData(data)
                return;
            }
            if (!Imgy.isImageUrl(url)) {
                // not an image
                insertData(data);
                return;
            }
            const imageName = url.pathname.split('/').pop();
            // Undefined string should not happen because this is an image
            const imageNameWithoutExtension = imageName ? imageName.substring(0, imageName.lastIndexOf('.')) : '';
            this.insertImageNode(editor, {
                url,
                alt: imageNameWithoutExtension,
            })

        }
    }


    insertImageNode(editor: Editor, imgAttrs: ImageAttributes) {
        const imageElement = {
            tag: ImagePlugin.NAME,
            url: imgAttrs.url,
            alt: imgAttrs.alt,
            children: []
        } as ImageElement;
        Transforms.insertNodes(editor, imageElement)
    }


    render({attributes, children, element}: RenderElementProps & { element: ImageElement }): React.ReactElement {
        const editor = useSlateStatic() as ReactEditor;
        const path = ReactEditor.findPath(editor, element)

        const selected = useSelected()
        const focused = useFocused()
        return (
            <div {...attributes}>
                {children}
                <div
                    contentEditable={false}
                    className={'position-relative'}
                >
                    <img
                        src={element.url.toString()}
                        style={{
                            boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none'
                        }}
                        className={styles.image}
                        alt={element.alt}
                    />
                    <RichSlateToolbarIconButton
                        selected
                        onClick={() => this.deleteImageNode(editor, path)}
                        iconName={'delete'}
                        style={{
                            display: selected && focused ? 'inline' : 'none'
                        }}
                        className={styles.imageDeleteButton}
                    />
                </div>
            </div>
        )
    }


    deleteImageNode(editor: ReactEditor, path: Location) {
        Transforms.removeNodes(editor, {at: path})
    }

    updateImage(editor: ReactEditor, imgPartialAttributes: Partial<ImageElement>, imagePath: Location) {
        /**
         * Set new properties on Element at location
         */
        Transforms.setNodes<ImageElement>(
            editor,
            imgPartialAttributes,
            {
                at: imagePath,
                match: n => this.isPluginElement(n)
            }
        );
    }
}
