/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {BaseEditor, Editor} from "slate";
import {RichSlateBuilder} from "../src/RichSlateBuilder";
import {RichSlateTest} from "./RichSlateTest";
import {ListPluginBuilder} from "../src/plugin/node/element/block/list/ListPluginBuilder";
import {ListPlugin} from "../src/plugin/node/element/block/list/ListPlugin";
import {ReactEditor} from "slate-react";
import {HistoryEditor} from "slate-history";


test('Create list test', () => {

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

    const listPluginBuilder = new ListPluginBuilder();
    const richSlateEditor = new RichSlateBuilder('test')
        .registerPlugin(listPluginBuilder)
        .withEditor(editor)
        .build();
    const listPlugin = richSlateEditor
        .getPlugin(listPluginBuilder.getName()) as ListPlugin;

    expect(listPlugin.isSelected(editor)).toBeFalsy();

    for (const tagDef of listPlugin.getElementDefinitions()) {
        expect(tagDef.isInlineElement()).toBeFalsy();
    }

    listPlugin.createList(editor, ListPlugin.UL)

    let editorStateExpected = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>the text</text>
                </element>
            </element>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)

    const urlElement = new RichSlateTest(richSlateEditor)
        .render()
        .queryEditableElement('ul');
    expect(urlElement).not.toBeNull();
    if(urlElement===null){
        throw new Error("ul should not be null")
    }
    const liElement = urlElement.querySelector("li");
    expect(liElement).not.toBeNull();
    expect(liElement).toHaveTextContent('the text')


})

test('Delete single list item test via action', () => {

    /**
     * Cursor: collapsed selection
     */
    const editor = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>the text
                        <cursor/>
                    </text>
                </element>
            </element>
        </editor>

    )

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const listPluginBuilder = new ListPluginBuilder();
    const richSlateEditor = new RichSlateBuilder('test')
        .registerPlugin(listPluginBuilder)
        .withEditor(editor)
        .build();
    const listPlugin = richSlateEditor
        .getPlugin(listPluginBuilder.getName()) as ListPlugin;

    expect(listPlugin.isSelected(editor)).toBeTruthy();

    listPlugin.deleteListItem(editor)

    let editorStateExpected = (
        <editor>
            <paragraph>
                <text>
                    the text
                </text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)

    const pElement = new RichSlateTest(richSlateEditor)
        .render()
        .queryEditableElement('p');
    expect(pElement).not.toBeNull();
    expect(pElement).toHaveTextContent('the text')


})

/**
 * If the cursor is at the start of a list item,
 * a backward delete, delete the list item
 */
test('Delete single list item test via backward delete', () => {

    /**
     * Cursor: collapsed selection
     */
    const editor = (
        <editor>
            <element tag={ListPlugin.UL}>
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

    const listPluginBuilder = new ListPluginBuilder();

    new RichSlateBuilder('test')
        .registerPlugin(listPluginBuilder)
        .withEditor(editor as BaseEditor & ReactEditor & HistoryEditor)
        .build()
        .getSlateEditor()
        .deleteBackward('character');

    let editorStateExpected = (
        <editor>
            <paragraph>
                <text>
                    the text
                </text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)


})

test('Delete second list item test via backward delete', () => {

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

    const listPluginBuilder = new ListPluginBuilder();

    new RichSlateBuilder('test')
        .registerPlugin(listPluginBuilder)
        .withEditor(editor as BaseEditor & ReactEditor & HistoryEditor)
        .build()
        .getSlateEditor()
        .deleteBackward('character');

    let editorStateExpected = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>
                        the text
                    </text>
                </element>
            </element>
            <paragraph>
                <text>
                    the text
                </text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)


})

test('Delete middle list item test via backward delete', () => {

    /**
     * Cursor: collapsed selection
     */
    const editor = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>
                        first
                    </text>
                </element>
                <element tag={ListPlugin.LI}>
                    <text>
                        <cursor/>
                        second
                    </text>
                </element>
                <element tag={ListPlugin.LI}>
                    <text>
                        third
                    </text>
                </element>
            </element>
        </editor>
    ) as Editor

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const listPluginBuilder = new ListPluginBuilder();

    new RichSlateBuilder('test')
        .registerPlugin(listPluginBuilder)
        .withEditor(editor as BaseEditor & ReactEditor & HistoryEditor)
        .build()
        .getSlateEditor()
        .deleteBackward('character');

    let editorStateExpected = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>
                        first
                    </text>
                </element>
            </element>
            <paragraph>
                <text>
                    second
                </text>
            </paragraph>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>
                        third
                    </text>
                </element>
            </element>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)


})

test('Delete with collapsed selection from a multiple list item test', () => {

    /**
     * Cursor: collapsed selection
     */
    const editor = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>the text</text>
                </element>
                <element tag={ListPlugin.LI}>
                    <text>
                        <cursor/>
                    </text>
                </element>
            </element>
        </editor>

    )

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const listPluginBuilder = new ListPluginBuilder();
    const richSlateEditor = new RichSlateBuilder('test')
        .registerPlugin(listPluginBuilder)
        .withEditor(editor)
        .build();
    const listPlugin = richSlateEditor
        .getPlugin(listPluginBuilder.getName()) as ListPlugin;

    expect(listPlugin.isSelectedTag(editor, ListPlugin.UL)).toBeTruthy();

    listPlugin.deleteListItem(editor)

    let editorStateExpected = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>the text</text>
                </element>
            </element>
            <paragraph>
                <text></text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)


})

test('Delete with range selection from a multiple list item test', () => {

    /**
     * Cursor: collapsed selection
     */
    const editor = (
        <editor>
            <element tag={ListPlugin.UL}>
                <element tag={ListPlugin.LI}>
                    <text>
                        <anchor/>
                        text first
                    </text>
                </element>
                <element tag={ListPlugin.LI}>
                    <text>
                        text second
                        <focus/>
                    </text>
                </element>
            </element>
        </editor>

    )

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const listPluginBuilder = new ListPluginBuilder();
    const richSlateEditor = new RichSlateBuilder('test')
        .registerPlugin(listPluginBuilder)
        .withEditor(editor)
        .build();
    const listPlugin = richSlateEditor
        .getPlugin(listPluginBuilder.getName()) as ListPlugin;

    expect(listPlugin.isSelectedTag(editor, ListPlugin.UL)).toBeTruthy();

    listPlugin.deleteListItem(editor)

    let editorStateExpected = (
        <editor>
            <paragraph>
                <text>text first</text>
            </paragraph>
            <paragraph>
                <text>text second</text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)


})
