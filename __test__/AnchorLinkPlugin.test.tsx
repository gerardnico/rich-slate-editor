/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {AnchorLinkPlugin} from "../src/plugin/node/element/inline/link/AnchorLinkPlugin";
import {Editor} from "slate";
import {AnchorLinkPluginBuilder} from "../src/plugin/node/element/inline/link/AnchorLinkPluginBuilder";
import {RichSlateBuilder} from "../src/RichSlateBuilder";
import {RichSlateTest} from "./RichSlateTest";
import {ReactEditor} from "slate-react";


test('Create link test', () => {

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
    ) as ReactEditor;

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const anchorLinkBuilder = new AnchorLinkPluginBuilder();
    const richSlateEditor = new RichSlateBuilder('test')
        .registerPlugin(anchorLinkBuilder)
        .withEditor(editor)
        .build();
    const anchorLinkPlugin = richSlateEditor
        .getPlugin(anchorLinkBuilder.getName()) as AnchorLinkPlugin;

    expect(anchorLinkPlugin.isSelected(editor)).toBeFalsy();

    const [tagDef] = anchorLinkPlugin.getElementDefinitions();
    expect(tagDef.isInlineElement()).toBeTruthy();


    const url = new URL('https://example.com');
    const title = 'Yolo';
    anchorLinkPlugin.createLink(editor, {url, title: title});

    let editorStateExpected = (
        <editor>
            <paragraph>
                <text></text>
                <element tag={AnchorLinkPlugin.TAG} url={url} title={title}>
                    <text>
                        the text
                        <cursor/>
                    </text>
                </element>
                <text>
                </text>
            </paragraph>
        </editor>
    ) as ReactEditor;

    expect(editor.children).toStrictEqual(editorStateExpected.children)
    expect(editor.selection).toStrictEqual(editorStateExpected.selection)


    const anchorElement = new RichSlateTest(richSlateEditor)
        .render()
        .queryEditableElement('a')
    expect(anchorElement).toHaveAttribute('href', url.toString())
    if (anchorElement == null) {
        throw new Error("anchor should not be null")
    }
    const titleValue = anchorElement.getAttribute('title');
    expect(titleValue).toContain(title)


})

test('Link Active Delete', () => {

    /**
     * Anchor: first node of the selection
     * Focus: last one
     */
    let url = new URL('http://example.com');
    const editor = (
        <editor>
            <paragraph>
                <text></text>
                <element tag={AnchorLinkPlugin.TAG} url={url}>
                    <text>the text
                        <cursor/>
                    </text>
                </element>
                <text></text>
            </paragraph>
        </editor>
    )

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const anchorLinkBuilder = new AnchorLinkPluginBuilder();
    const richSlateEditor = new RichSlateBuilder('test')
        .registerPlugin(anchorLinkBuilder)
        .withEditor(editor)
        .build();
    const anchorLinkPlugin = richSlateEditor
        .getPlugin(anchorLinkBuilder.getName()) as AnchorLinkPlugin;
    expect(anchorLinkPlugin.isSelected(editor)).toBeTruthy()

    anchorLinkPlugin.deleteLinksInSelection(editor);

    const editorStateExpected = (
        <editor>
            <paragraph>
                <text>the text</text>
            </paragraph>
        </editor>
    )
    expect(editor.children).toStrictEqual(editorStateExpected.children)

})


test('Update link test', () => {

    const old = new URL('https://old.com');
    /**
     * Anchor: first node of the selection
     * Focus: last one
     */
    const editor = (
        <editor>
            <paragraph>
                <text></text>
                <element tag={AnchorLinkPlugin.TAG} url={old}>
                    <text>the text
                        <cursor/>
                    </text>
                </element>
                <text></text>
            </paragraph>
        </editor>
    )

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const anchorLinkBuilder = new AnchorLinkPluginBuilder();
    const richSlateEditor = new RichSlateBuilder('test')
        .registerPlugin(anchorLinkBuilder)
        .withEditor(editor)
        .build();
    const anchorLinkPlugin = richSlateEditor
        .getPlugin(anchorLinkBuilder.getName()) as AnchorLinkPlugin;

    expect(anchorLinkPlugin.isSelected(editor)).toBeTruthy();

    const [tagDef] = anchorLinkPlugin.getElementDefinitions();
    expect(tagDef.isInlineElement()).toBeTruthy();


    const newUrl = new URL('https://new.com');
    const title = 'Yolo';
    anchorLinkPlugin.updateLink(editor, {url: newUrl, title: title});

    let editorStateExpected = (
        <editor>
            <paragraph>
                <text></text>
                <element tag={AnchorLinkPlugin.TAG} url={newUrl} title={title}>
                    <text>the text</text>
                </element>
                <text></text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)


})
