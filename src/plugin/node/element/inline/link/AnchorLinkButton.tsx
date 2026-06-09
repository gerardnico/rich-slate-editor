import React, {MouseEvent, useState} from "react";
import {ReactEditor, useSlate} from "slate-react";
import {RichSlateToolbarIconButton} from "../../../../../component/toolbars/RichSlateToolbarIconButton.tsx";
import {AnchorLinkDialog} from "./AnchorLinkDialog";
import {useRichSlatePlugin} from "../../../../../component/context/useRichSlatePlugin";
import {AnchorLinkPlugin} from "./AnchorLinkPlugin";


/**
 * The button control of the link plugin.
 * We set it up in its own file so that we have a fast-refresh
 * @param props
 * @param ref
 * @constructor
 */
export const AnchorLinkButton = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
    (props: React.HTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {

        const [dialogOpen, setDialogOpen] = useState(false);

        /**
         * useSlate and not useSlateStatic
         * to be notified when the state change
         */
        const editor = useSlate() as ReactEditor
        const anchorPlugin = useRichSlatePlugin<AnchorLinkPlugin>(AnchorLinkPlugin.TAG);
        if (anchorPlugin === undefined) {
            return <p>Anchor plugin is not enabled</p>
        }
        let active = anchorPlugin.isSelected(editor);
        const iconName = 'link';

        let title;
        if (active) {
            title = 'Delete the link';
        } else {
            title = 'Add a link';
        }
        return (
            <>
                <RichSlateToolbarIconButton
                    {...props}
                    ref={ref as React.ForwardedRef<HTMLButtonElement>}
                    selected={active}
                    iconName={iconName}
                    title={title}
                    onClick={(event: MouseEvent) => {
                        event.preventDefault()
                        setDialogOpen(true)
                    }}
                >
                </RichSlateToolbarIconButton>
                {dialogOpen && (
                    <AnchorLinkDialog setDialogOpen={setDialogOpen}/>
                )}
            </>
        )
    })
