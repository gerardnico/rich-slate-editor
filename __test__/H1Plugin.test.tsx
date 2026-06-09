/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {H1Plugin} from "../src/plugin/node/element/block/heading/H1Plugin";
import {RichSlateBuilder} from "../src/RichSlateBuilder";
import {H1PluginBuilder} from "../src/plugin/node/element/block/heading/H1PluginBuilder";
import {RichSlateTest} from "./RichSlateTest";
import {Editor} from "slate";
import {HTMLTest} from "./HTMLTest";

/**
 * We test the boolean blocks with h1
 */
test('heading boolean block test', () => {

    /**
     * Anchor: first position of the selection
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
    ) as Editor;

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const h1PluginBuilder = new H1PluginBuilder();
    let richSlate = new RichSlateBuilder('test')
        .registerPlugin(h1PluginBuilder)
        .withEditor(editor)
        .build();
    const h1 = richSlate
        .getPlugin(h1PluginBuilder.getName()) as H1Plugin;

    h1.toggle(editor);

    let editorStateExpected = (
        <editor>
            <element tag="h1">
                <text>the text</text>
            </element>
        </editor>
    ) as Editor;
    expect(editor.children).toStrictEqual(editorStateExpected.children)

    const h1Element = new RichSlateTest(richSlate)
        .render()
        .queryEditableElement('h1');
    if(h1Element==null){
        throw new Error("h1 should not be null")
    }
    expect(h1Element).toHaveTextContent('the text')
    console.log(HTMLTest.prettyPrint(h1Element.innerHTML))

})
