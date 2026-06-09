/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {Editor, Point, Range as SlateRange} from "slate";
import {TagElement} from "../src/plugin/IElementDef";
import {PElementPlugin} from "../src/plugin/node/element/block/paragraph/PElementPlugin";
import {CustomSlateEditor} from "../src/CustomSlateEditor";


test('Get word (before)', () => {

    const editor = (
        <editor>
            <paragraph>
                <text>
                    First
                    Second


                    <cursor/>
                </text>
            </paragraph>
        </editor>
    )

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    // Get the word before
    const [start] = SlateRange.edges(editor.selection)
    // Before returns a location before
    // (undefined at the top of the document)
    // by default:
    // the distance is 1
    // and the unit is 'offset'. You can choose also 'character' | 'word' | 'line' | 'block'
    const wordBefore = Editor.before(editor, start, {distance: 1, unit: "word"})
    if(wordBefore==null){
        throw new Error("wordBefore should not be null")
    }
    const beforeRange = Editor.range(editor, wordBefore, start)
    const beforeText = Editor.string(editor, beforeRange)
    expect(beforeText).toBe("Second")

})

test('Get ancestor (above)', () => {

    const editor = (
        <editor>
            <paragraph>
                <text>
                    <cursor/>
                    Text
                </text>
            </paragraph>
        </editor>
    )

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    // Get the ancestor
    const paragraphNodeEntry = Editor.above(editor);
    assert(paragraphNodeEntry !== undefined);
    const [element,] = paragraphNodeEntry;
    expect((element as TagElement).tag).toBe(PElementPlugin.PARAGRAPH_TAG);


})

test('Start point of Element', () => {
    const editor = (
        <editor>
            <paragraph>
                <text>
                    <cursor/>
                    Text
                </text>
            </paragraph>
        </editor>
    ) as Editor

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    // Get the ancestor
    let above = Editor.above(editor);
    assert(above !== undefined);
    const [pElement, path] = above;
    const start = Editor.start(editor, path)

    // The start point of the element is the anchor of the selection
    assert(editor.selection !== null);
    const equals = Point.equals(editor.selection.anchor, start)
    expect(equals).toBeTruthy()


})

test('Selection as range and is not collapsed', () => {

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
    /**
     * Test the doc:
     * https://docs.slatejs.org/concepts/03-locations#selection
     *
     * The cursor is at :
     * 0: paragraph is the first element in the hierarchy path
     * 0: text is the first element in the hierarchy path
     * offset: 8, the 8 characters
     */
    expect(editor.selection).toStrictEqual(
        {
            anchor: {path: [0, 0], offset: 0},
            focus: {path: [0, 0], offset: 8},
        }
    )
    const isCollapsed = SlateRange.isCollapsed(editor.selection)
    expect(isCollapsed).toBeFalsy();


})

test('Selection as cursor and Range collapsed', () => {

    const editor = (
        <editor>
            <paragraph>
                <text>
                    the text
                    <cursor/>
                </text>
            </paragraph>
        </editor>
    )

    /**
     * Test the doc:
     * https://docs.slatejs.org/concepts/03-locations#selection
     *
     * The cursor is at :
     * 0: paragraph is the first element in the hierarchy path
     * 0: text is the first element in the hierarchy path
     * offset: 8, the 8 characters
     */
    expect(editor.selection).toStrictEqual(
        {
            anchor: {path: [0, 0], offset: 8},
            focus: {path: [0, 0], offset: 8},
        }
    )
    const isCollapsed = SlateRange.isCollapsed(editor.selection)
    expect(isCollapsed).toBeTruthy();


})


test('Selection to Select All', () => {
    const editor = (
        <editor>
            <paragraph>
                <text>

                    First
                </text>
            </paragraph>
            <paragraph>
                <text>
                    <cursor/>
                    Second
                </text>
            </paragraph>
        </editor>
    ) as Editor

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    CustomSlateEditor.selectAll(editor);

    const editorExpected = (
        <editor>
            <paragraph>
                <text>
                    <anchor/>
                    First
                </text>
            </paragraph>
            <paragraph>
                <text>
                    Second
                    <focus/>
                </text>
            </paragraph>
        </editor>
    ) as Editor


    expect(editor.selection).toStrictEqual(editorExpected.selection)


})
