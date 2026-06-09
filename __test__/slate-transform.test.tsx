/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {Editor, Transforms} from "slate";
import {ListPlugin} from "../src/plugin/node/element/block/list/ListPlugin";

/**
 * Unwrap without split
 * delete the element at location
 */
test('Unwrap without split', () => {

    /**
     * Cursor: collapsed selection
     */
    const editor = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>
                        the text
                    </text>
                </element>
                <element tag={ListPlugin.LI}>
                    <text>
                        <cursor/>
                        the text
                    </text>
                </element>
            </element>
        </editor>
    ) as Editor

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    /**
     * By default unwrap delete
     */
    Transforms.unwrapNodes(editor)

    const editorStateExpected = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>
                        the text
                        <cursor/>
                    </text>
                </element>
            </element>
        </editor>
    ) as Editor;
    expect(editor.children).toStrictEqual(editorStateExpected.children)
    expect(editor.selection).toStrictEqual(editorStateExpected.selection)

})

test('Unwrap with split', () => {

    /**
     * Cursor: collapsed selection
     */
    const editor = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>
                        the text
                    </text>
                </element>
                <element tag={ListPlugin.LI}>
                    <text>
                        <cursor/>
                        the text
                    </text>
                </element>
            </element>
        </editor>
    ) as Editor

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    /**
     * Unwrap
     */
    Transforms.unwrapNodes(editor, {
        // match should match the parent of the node to unwrap
        // without match, it will delete the element
        match: n => 'tag' in n && n.tag === ListPlugin.UL,
        split: true
    })

    let editorStateExpected = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>
                        the text
                    </text>
                </element>
            </element>
            <element tag={ListPlugin.LI}>
                <text>
                    <cursor/>
                    the text
                </text>
            </element>
        </editor>
    ) as Editor;
    expect(editor.children).toStrictEqual(editorStateExpected.children)
    expect(editor.selection).toStrictEqual(editorStateExpected.selection)


})
