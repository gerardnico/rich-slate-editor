import React, {useMemo} from 'react'
import {RichSlateBuilder} from "../../RichSlateBuilder.ts";
import {BoldMarkPluginBuilder} from "../../plugin/attribute/mark/BoldMarkPluginBuilder.ts";
import {ItalicMarkPluginBuilder} from "../../plugin/attribute/mark/ItalicMarkPluginBuilder.ts";
import {UnderlineMarkPluginBuilder} from "../../plugin/attribute/mark/UnderlineMarkPluginBuilder.ts";
import {HistoryPluginBuilder} from "../../plugin/history/HistoryPluginBuilder.tsx";
import {H1PluginBuilder} from "../../plugin/node/element/block/heading/H1PluginBuilder.ts";
import {H2PluginBuilder} from "../../plugin/node/element/block/heading/H2PluginBuilder.ts";
import {AlignPluginBuilder} from "../../plugin/attribute/align/AlignPluginBuilder.ts";
import {ListPluginBuilder} from "../../plugin/node/element/block/list/ListPluginBuilder.ts";
import {AnchorLinkPluginBuilder} from "../../plugin/node/element/inline/link/AnchorLinkPluginBuilder.ts";
import {VariablePluginBuilder} from "../../plugin/node/element/inline/variable/VariablePluginBuilder.ts";
import {LocalStoragePluginBuilder} from "../../plugin/persist/local-storage/LocalStoragePluginBuilder.ts";
import {LocalStoragePlugin} from "../../plugin/persist/local-storage/LocalStoragePlugin.ts";
import {RichSlateEditor} from "../rich-slate/RichSlateEditor.tsx";
import {RichSlateHoveringToolbar} from "../toolbars/RichSlateHoveringToolbar.tsx";
import {RichSlateToolbar} from "../toolbars/RichSlateToolbar.tsx";
import {RichSlateEditable} from "../rich-slate/RichSlateEditable.tsx";

/**
 * A basic rich text editor, that you can take as example
 * to compose your own.
 * @param name - a unique name (used to back up locally the content)
 * @constructor
 */
export const RichSlateTextArea = ({name}: { name: string }) => {

    /**
     * Create a Slate editor object
     * that won't change across renders.
     */
    const localStorageBuilder = new LocalStoragePluginBuilder();
    const richSlate = useMemo(() => {
            return new RichSlateBuilder(name)
                .registerPlugin(new HistoryPluginBuilder())
                .registerPlugin(new BoldMarkPluginBuilder())
                .registerPlugin(new ItalicMarkPluginBuilder())
                .registerPlugin(new UnderlineMarkPluginBuilder())
                .registerPlugin(new H1PluginBuilder())
                .registerPlugin(new H2PluginBuilder())
                .registerPlugin(new AnchorLinkPluginBuilder())
                .registerPlugin(new AlignPluginBuilder())
                .registerPlugin(new ListPluginBuilder())
                .registerPlugin(new VariablePluginBuilder())
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
            <RichSlateEditable
                className={'shadow p-3 mb-5 bg-body rounded focus-ring-light'}
                placeholder="Starts by writing something"
            />
            {/*
                The area below the editable element.
                The hovering toolbar was added but is not mandatory.
             */}
            <RichSlateHoveringToolbar/>
        </RichSlateEditor>
    )
}
