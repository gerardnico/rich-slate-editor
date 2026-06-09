/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {Editor} from "slate";
import {RichSlateBuilder} from "../src/RichSlateBuilder";
import {ArrowLeftRightPluginBuilder} from "../src/plugin/keyboard/arrow/ArrowLeftRightPluginBuilder";
import {AnchorLinkPlugin} from "../src/plugin/node/element/inline/link/AnchorLinkPlugin";
import {AnchorLinkPluginBuilder} from "../src/plugin/node/element/inline/link/AnchorLinkPluginBuilder";
import {ReactEditor} from "slate-react";
import {RichSlateTest} from "./RichSlateTest";


/**
 * At the end of a paragraph,
 * a right arrow should put the cursor
 * into the empty text node
 */
test('Test navigation at end of paragraph', async () => {

    const url = new URL('https://url.com');
    /**
     * Anchor: first node of the selection
     * Focus: last one
     */
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
            <paragraph>
                <text></text>
            </paragraph>
        </editor>
    ) as ReactEditor

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const anchorLinkBuilder = new AnchorLinkPluginBuilder();
    const richSlate = new RichSlateBuilder('test')
        .registerPlugin(anchorLinkBuilder)
        .registerPlugin(new ArrowLeftRightPluginBuilder())
        .withEditor(editor)
        .build();

    await new RichSlateTest(richSlate)
        .render()
        .pressKey('right');

    let editorStateExpected = (
        <editor>
            <paragraph>
                <text></text>
                <element tag={AnchorLinkPlugin.TAG} url={url}>
                    <text>the text</text>
                </element>
                <text>
                    <cursor/>
                </text>
            </paragraph>
            <paragraph>
                <text></text>
            </paragraph>
        </editor>
    ) as ReactEditor;
    expect(editor.children).toStrictEqual(editorStateExpected.children)
    expect(editor.selection).toStrictEqual(editorStateExpected.selection)


})
