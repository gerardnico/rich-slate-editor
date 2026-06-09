/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {Editor} from "slate";
import {RichSlateBuilder} from "@/RichSlateBuilder.ts";
import {AlignPluginBuilder} from "@/plugin/attribute/align/AlignPluginBuilder.ts";
import {AlignPlugin, AlignValue} from "@/plugin/attribute/align/AlignPlugin.tsx";
import {RichSlateTest} from "./RichSlateTest";
import {HTMLTest} from "./HTMLTest";


test('Set and unset align test', () => {

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
    ) as Editor

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const alignBuilder = new AlignPluginBuilder();
    const richSlate = new RichSlateBuilder('test')
        .registerPlugin(alignBuilder)
        .withEditor(editor)
        .build();
    const alignPlugin = richSlate
        .getPlugin(alignBuilder.getName()) as AlignPlugin;

    const value: AlignValue = 'center';
    expect(alignPlugin.isAttributeValueActive(editor, value)).toBeFalsy();

    alignPlugin.setProperty(editor, value);

    const editorStateExpected = (
        <editor>
            <paragraph align={value}>
                <text>
                    the text
                </text>
            </paragraph>
        </editor>
    );
    expect(editor.children).toStrictEqual(editorStateExpected.children)

    const richSlateTest = new RichSlateTest(richSlate);
    richSlateTest.render();
    const pElement = document.querySelector('div[data-slate-editor="true"] p');
    if (pElement == null) {
        throw new Error("p element should not be null")
    }
    console.log(HTMLTest.prettyPrint(pElement.outerHTML))
    expect(pElement).toHaveStyle({'text-align': value})

    /**
     * Delete
     */
    alignPlugin.unsetProperty(editor)
    const deleteEditorStateExpected = (
        <editor>
            <paragraph>
                <text>
                    the text
                </text>
            </paragraph>
        </editor>
    ) as Editor;
    expect(editor.children).toStrictEqual(deleteEditorStateExpected.children)

})
