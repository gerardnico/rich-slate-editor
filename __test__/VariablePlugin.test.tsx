/** @jsx jsx */
/** @jsxRuntime classic */
/// <reference path="jsxIntrinsicElement.d.ts" />
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";
import {Editor} from "slate";
import {RichSlateBuilder} from "../src/RichSlateBuilder";
import {VariablePluginBuilder} from "../src/plugin/node/element/inline/variable/VariablePluginBuilder";
import {VariablePlugin} from "../src/plugin/node/element/inline/variable/VariablePlugin";


test('CheckVariableMatchAtBeginningOfParagraphLine', () => {


    const editor = (
        <editor>
            <paragraph>
                <text>
                    $nam
                    <cursor/>
                </text>
            </paragraph>
        </editor>
    ) as Editor

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const variablePluginBuilder = new VariablePluginBuilder();
    const richSlate = new RichSlateBuilder('test')
        .registerPlugin(variablePluginBuilder)
        .withEditor(editor)
        .build();
    const variablePlugin = richSlate.getPlugin(variablePluginBuilder.getName()) as VariablePlugin;

    const {range, match} = variablePlugin.detectVariableAtCurrentSelection(editor);

    expect(match).toBe('nam');
    expect(range).toStrictEqual({
        "anchor": {
            "offset": 0,
            "path": [
                0,
                0,
            ],
        },
        "focus": {
            "offset": 4,
            "path": [
                0,
                0,
            ],
        },
    });

})

test('Check Variable Match with only the dollar', () => {


    const editor = (
        <editor>
            <paragraph>
                <text>$
                    <cursor/>
                </text>
            </paragraph>
        </editor>
    ) as Editor

    // If the JSX property at the top of the file are not good,
    // we may get just a non-modifiable React tree
    expect(Editor.isEditor(editor)).toBeTruthy();

    const variablePluginBuilder = new VariablePluginBuilder();
    const richSlate = new RichSlateBuilder('test')
        .registerPlugin(variablePluginBuilder)
        .withEditor(editor)
        .build();
    const variablePlugin = richSlate.getPlugin(variablePluginBuilder.getName()) as VariablePlugin;

    const {range, match} = variablePlugin.detectVariableAtCurrentSelection(editor);

    expect(match).toBe('');
    expect(range).toStrictEqual({
        "anchor": {
            "offset": 0,
            "path": [
                0,
                0,
            ],
        },
        "focus": {
            "offset": 1,
            "path": [
                0,
                0,
            ],
        },
    });

})
