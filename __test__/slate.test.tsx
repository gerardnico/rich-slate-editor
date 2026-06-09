/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {CustomSlateEditor} from "@/CustomSlateEditor.ts";
import {Editor, Transforms} from "slate";


test('Insert Soft Break', () => {

    /**
     * Anchor: first node of the selection
     * Focus: last one
     */
    const editor = (
        <editor>
            <paragraph>
                <text>
                    <anchor/>
                    the text
                    <focus/>
                </text>
            </paragraph>
        </editor>
    )
    if (CustomSlateEditor.isModelEditor(editor)) {
        CustomSlateEditor.insertSoftBreak(editor);
    }
    let editorStateExpected = (
        <editor>
            <paragraph>
                <text></text>
            </paragraph>
            <paragraph>
                <text></text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)

    // renderEditor(editor)
    // let spanBoldElement = document.querySelector('div[data-slate-editor="true"] [data-slate-leaf="true"]');
    // expect(spanBoldElement).toHaveStyle({'font-weight':'bold'})
    // expect(spanBoldElement).toHaveTextContent('the text')
    // console.log(prettyPrint(spanBoldElement.innerHTML))

})


test('Transforms - Insert Text', () => {

    const editor = (
        <editor>
            <paragraph>word</paragraph>
        </editor>
    )

    if (Editor.isEditor(editor)) {
        Transforms.insertText(editor, 'x', {at: [0]})
    }


    const editorStateExpected = (
        <editor>
            <paragraph>x</paragraph>
        </editor>
    )

    expect(editor.children).toStrictEqual(editorStateExpected.children)
    expect(editor.selection).toStrictEqual(editorStateExpected.selection)

});
