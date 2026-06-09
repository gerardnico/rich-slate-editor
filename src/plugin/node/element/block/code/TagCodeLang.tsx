import {Node as SlateNode, Transforms} from "slate";
import {BlockElementPlugin} from "../../../../BlockElementPlugin";
import {PElementPlugin} from "../paragraph/PElementPlugin";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {ReactEditor, useSlateStatic} from "slate-react";
import React, {ChangeEvent, JSX, useCallback} from "react";
import {CODE_LANG_LINE_TAG} from "./TagCodeLangLine";
import {RichElement} from "../../../../RichElement";
import {TagElement} from "../../../../IElementDef";
import {CustomSlateEditorType} from "@/CustomSlateEditor.ts";
import {css} from '@emotion/css';

export type TagCodeLangType = 'code-lang'
const CODE_BLOCK_TAG: TagCodeLangType = 'code-lang';
export type TagCodeLangElement = TagElement & {
    tag: TagCodeLangType
    language: string
}


const LanguageSelect = (props: JSX.IntrinsicElements['select']) => {
    return (
        <select
            data-test-id="language-select"
            contentEditable={false}
            className={css`
                position: absolute;
                right: 5px;
                top: 5px;
                z-index: 1;
            `}
            {...props}
        >
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="jsx">JSX</option>
            <option value="markdown">Markdown</option>
            <option value="php">PHP</option>
            <option value="python">Python</option>
            <option value="sql">SQL</option>
            <option value="tsx">TSX</option>
            <option value="typescript">TypeScript</option>
        </select>
    )
}


// noinspection JSUnusedGlobalSymbols
export class TagCodeLang extends BlockElementPlugin {


    getName(): string {
        return CODE_BLOCK_TAG;
    }

    wrapCode = (editor: CustomSlateEditorType) => {

        /**
         * Wrap node the selected nodes with a code block
         */
        Transforms.wrapNodes(
            editor,
            {tag: CODE_BLOCK_TAG, language: 'html', children: []} as TagCodeLangElement,
            {
                match: n => PElementPlugin.isParagraphElement(n),
                split: true,
            }
        )

        /**
         * Transform all selected paragraph node as code block line
         */
        Transforms.setNodes(
            editor,
            {tag: CODE_LANG_LINE_TAG},
            {match: n => PElementPlugin.isParagraphElement(n),}
        )

    }


    static isCodeBlockElement = (node: SlateNode) => {
        return RichElement.isTagElement(node) && node.tag === CODE_BLOCK_TAG
    }


    commandIconName(): string {
        return 'code';
    }

    isVoidElement(): boolean {
        return false;
    }

    render({attributes, children, element}: RenderElementProps & { element: TagCodeLangElement }): JSX.Element {

        const editor = useSlateStatic() as ReactEditor;

        const setLanguage = (language: string) => {
            const path = ReactEditor.findPath(editor, element)
            Transforms.setNodes(editor, {language} as Partial<TagCodeLangElement>, {at: path})
        }

        let onChangeCallback = useCallback((e: ChangeEvent) => setLanguage((e.target as HTMLSelectElement).value), []);

        return (
            <div
                {...attributes}
                className={css(`
        font-family: monospace;
        font-size: 16px;
        line-height: 20px;
        margin-top: 0;
        background: rgba(0, 20, 60, .03);
        padding: 5px 13px;
      `)}
                style={{position: 'relative'}}
                spellCheck={false}
            >
                <LanguageSelect
                    value={(element as TagCodeLangElement).language}
                    onChange={onChangeCallback}
                />
                {children}
            </div>
        )

    }

}
