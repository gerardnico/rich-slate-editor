import React, {useState} from "react";
import {AnchorLinkPlugin} from "./AnchorLinkPlugin";
import {ReactEditor, useSlateStatic} from "slate-react";
import {useRichSlatePlugin} from "@/component/context/useRichSlatePlugin.ts";
import {AnchorLinkDialog} from "./AnchorLinkDialog.tsx";
import {
    useRichSlateDoubleClickSubscription
} from "@/component/context/useRichSlateDoubleClickSubscription.ts";

/**
 * The portal
 * @constructor
 */
export const AnchorLinkPortal = function (props: React.HTMLAttributes<HTMLDivElement>) {


    const editor = useSlateStatic() as ReactEditor;
    const [dialogOpen, setDialogOpen] = useState(false);
    const anchorPlugin = useRichSlatePlugin<AnchorLinkPlugin>(AnchorLinkPlugin.TAG);

    /**
     * Double-click Subscription
     */
    useRichSlateDoubleClickSubscription(anchorPlugin, (event) => {
        if (!anchorPlugin.isSelected(editor)) {
            return;
        }
        event.preventDefault();
        setDialogOpen(true);
    })


    if (!dialogOpen) {
        return null;
    }

    return (
        <AnchorLinkDialog setDialogOpen={setDialogOpen} {...props}/>
    )
}
