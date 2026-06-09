/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {RichSlateTest} from "./RichSlateTest";
import {BoldMarkPlugin} from "../src/plugin/attribute/mark/BoldMarkPlugin";
import {RichSlateBuilder} from "../src/RichSlateBuilder";
import {BoldMarkPluginBuilder} from "../src/plugin/attribute/mark/BoldMarkPluginBuilder";
import {Editor} from "slate";
import {HTMLTest} from "./HTMLTest";

const boldMarkPluginBuilder = new BoldMarkPluginBuilder();
/**
 * Mark are just attributes on text element
 * such as bold, italic, ...
 */
test('boolean mark (bold)', () => {

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

    const richSlateEditor = new RichSlateBuilder('test')
        .registerPlugin(boldMarkPluginBuilder)
        .withEditor(editor)
        .build();
    const boldPlugin = richSlateEditor
        .getPlugin(boldMarkPluginBuilder.getName()) as BoldMarkPlugin;
    boldPlugin.toggleBooleanMark(editor);

    // noinspection HtmlUnknownAttribute
    let editorStateExpected = (
        <editor>
            <paragraph>
                <text bold>the text</text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)

    const spanBoldElement = new RichSlateTest(richSlateEditor)
        .render()
        .queryEditableElement('[data-slate-leaf="true"]');
    if(spanBoldElement==null){
        throw new Error("anchor should not be null")
    }
    expect(spanBoldElement).toHaveStyle({'font-weight':'bold'})
    expect(spanBoldElement).toHaveTextContent('the text')
    console.log(HTMLTest.prettyPrint(spanBoldElement.innerHTML))

})

test('boolean mark (bold) on selection', () => {

    /**
     * Ast Transformation Test
     *
     * Anchor: first node of the selection
     * Focus: last one
     */
    const editor = (
        <editor>
            <paragraph>
                <text>
                    the non-bold text
                    <anchor/>
                    the bold text
                    <focus/>
                </text>
            </paragraph>
        </editor>
    )

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const richSlate = new RichSlateBuilder("test")
        .registerPlugin(boldMarkPluginBuilder)
        .withEditor(editor)
        .build()
    const boldMarkPlugin = richSlate.getPlugin(boldMarkPluginBuilder.getName()) as BoldMarkPlugin;
    boldMarkPlugin.toggleBooleanMark(editor);

    let editorStateExpected = (
        <editor>
            <paragraph>
                <text>the non-bold text</text>
                <text bold>the bold text</text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)

    /**
     * Rendering test
     */
    const spanBoldElement = new RichSlateTest(richSlate)
        .render()
        .queryEditableElement('p span:nth-child(2) span')
    if(spanBoldElement==null){
        throw new Error("anchor should not be null")
    }
    console.log(HTMLTest.prettyPrint(spanBoldElement.outerHTML))
    expect(spanBoldElement).toHaveStyle('font-weight: bold')
    expect(spanBoldElement).toHaveTextContent('the bold text')

})
