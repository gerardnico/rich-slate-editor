import React, {useMemo} from 'react'
import {RichSlateBuilder} from "../../src/RichSlateBuilder.ts";

import {HistoryPluginBuilder} from "../../src/plugin/history/HistoryPluginBuilder.tsx";
import {H1PluginBuilder} from "../../src/plugin/node/element/block/heading/H1PluginBuilder.ts";

import {LocalStoragePluginBuilder} from "../../src/plugin/persist/local-storage/LocalStoragePluginBuilder.ts";
import {LocalStoragePlugin} from "../../src/plugin/persist/local-storage/LocalStoragePlugin.ts";
import {RichSlateEditor} from "../../src/component/rich-slate/RichSlateEditor.tsx";
import {RichSlateToolbar} from "../../src/component/toolbars/RichSlateToolbar.tsx";
import RichSlateMarkdownEditable from "./RichSlateMarkdownEditable.tsx";

/**
 * A basic rich text editor, that you can take as example
 * to compose your own.
 * @param name - a unique name (used to back up locally the content)
 * @constructor
 */
export const RichSlateMarkdownEditor = ({name}: { name: string }) => {

    /**
     * Create a Slate editor object
     * that won't change across renders.
     */
    const localStorageBuilder = new LocalStoragePluginBuilder();
    const richSlate = useMemo(() => {
            return new RichSlateBuilder(name)
                .registerPlugin(new HistoryPluginBuilder())
                .registerPlugin(new H1PluginBuilder())
                .registerPlugin(localStorageBuilder)
                .build()
        }
        , [name]);

    const localStoragePlugin = richSlate.getPlugin<LocalStoragePlugin>(localStorageBuilder.getName());

    /**
     * Portal component are not part of the layout because they are invisible and mandatory
     * They are in the RichSlateEditor component
     */
    return (
        <RichSlateEditor richSlate={richSlate}>
            {/*The Toolbar above the text area*/}
            <RichSlateToolbar storagePlugin={localStoragePlugin}/>
            {/*The text area / editable element*/}
            {/*
                The area below the editable element.
                The hovering toolbar was added but is not mandatory.
             */}
            <RichSlateMarkdownEditable/>
        </RichSlateEditor>
    )
}
