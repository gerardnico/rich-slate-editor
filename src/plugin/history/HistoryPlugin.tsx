import {RichSlatePlugin} from "../RichSlatePlugin.tsx";
import React from "react";
import isHotkey from "is-hotkey";
import {HistoryUndoButton} from "./HistoryUndoButton";
import {HistoryRedoButton} from "./HistoryRedoButton";
import {RichSlate} from "../../RichSlate.tsx";


export const REDO_HOT_KEY = 'mod+shift+z';

export const UNDO_HOT_KEY = 'mod+z';

/**
 * The history plugin is automatically built-in added
 */
export class HistoryPlugin extends RichSlatePlugin {

    static NAME: string = "history";


    constructor(name: string, richSlate: RichSlate) {
        super(name, richSlate);

        richSlate.addToolbarButtons(this, [HistoryUndoButton, HistoryRedoButton]);

        richSlate.addOnKeyDownHandler({
            plugin: this,
            name: 'default',
            handler: (event: React.KeyboardEvent) => {

                if (isHotkey(UNDO_HOT_KEY, event)) {
                    event.preventDefault()
                    this.getSlateEditor().undo();
                    return;
                }

                if (!isHotkey(REDO_HOT_KEY, event)) {
                    return;
                }
                event.preventDefault()
                this.getSlateEditor().redo();
            }
        })
    }


}
