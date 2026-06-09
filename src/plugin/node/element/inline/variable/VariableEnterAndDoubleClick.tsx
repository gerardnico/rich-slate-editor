import React, {useState} from "react";
import {ReactEditor, useSlateStatic} from "slate-react";
import {useRichSlatePlugin} from "../../../../../component/context/useRichSlatePlugin";
import {
    useRichSlateDoubleClickSubscription
} from "../../../../../component/context/useRichSlateDoubleClickSubscription.ts";
import {VariablePlugin} from "./VariablePlugin.tsx";
import {VariableDialog} from "./VariableDialog.tsx";
import {useRichSlateKeyDownSubscription} from "../../../../../component/context/useRichSlateKeyDownSubscription.ts";

/**
 * The portal
 * @constructor
 */
export const VariableEnterAndDoubleClick = function (props: React.HTMLAttributes<HTMLDivElement>) {


    const editor = useSlateStatic() as ReactEditor;
    const [dialogOpen, setDialogOpen] = useState(false);
    const variablePlugin = useRichSlatePlugin<VariablePlugin>(VariablePlugin.NAME);

    /**
     * Double-click Subscription
     */
    useRichSlateDoubleClickSubscription(variablePlugin, (event) => {
        if (!variablePlugin.isSelected(editor)) {
            return;
        }
        event.preventDefault();
        setDialogOpen(true);
    })

    /**
     * Enter Subscription
     */
    useRichSlateKeyDownSubscription(variablePlugin, 'keydown', (event: React.KeyboardEvent) => {
        if (event.key !== 'Enter') {
            return;
        }
        if (!variablePlugin.isSelected(editor)) {
            return;
        }
        event.preventDefault();
        setDialogOpen(true);
    })


    if (!dialogOpen) {
        return null;
    }

    return (
        <VariableDialog setDialogOpen={setDialogOpen} {...props}/>
    )
}
