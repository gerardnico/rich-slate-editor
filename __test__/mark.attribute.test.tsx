/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {Editor} from "slate";


test('mark with value', () => {

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

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    let value = 'lg';
    Editor.addMark(editor, 'key', value);

    // noinspection HtmlUnknownAttribute
    let editorStateExpected = (
        <editor>
            <paragraph>
                <text key={value}>the text</text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)

})
