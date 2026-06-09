import React, {MouseEvent, useState} from "react";
import {ReactEditor, useSlate} from "slate-react";
import {RichSlateToolbarIconButton} from "../../../../../component/toolbars/RichSlateToolbarIconButton.tsx";
import {useRichSlatePlugin} from "../../../../../component/context/useRichSlatePlugin";
import {VariableDialog} from "./VariableDialog.tsx";
import {VariablePlugin} from "./VariablePlugin.tsx";


/**
 * The button control of the link plugin.
 * We set it up in its own file so that we have a fast-refresh
 * @param props
 * @param ref
 * @constructor
 */
export const VariableButton = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
    (props: React.HTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {

        const [dialogOpen, setDialogOpen] = useState(false);

        /**
         * useSlate and not useSlateStatic
         * to be notified when the state change
         */
        const editor = useSlate() as ReactEditor
        const variablePlugin = useRichSlatePlugin<VariablePlugin>(VariablePlugin.NAME);
        if (variablePlugin === undefined) {
            return <p>Variable plugin is not enabled</p>
        }
        let active = variablePlugin.isSelected(editor);
        const iconName = 'variable';

        let title;
        if (active) {
            // we don't delete because
            // * the dialog shows all variables and their definition
            // * it's easier to do it with the backward key
            title = 'Update/Delete the variable';
        } else {
            title = 'Add a variable';
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
                    <VariableDialog setDialogOpen={setDialogOpen}/>
                )}
            </>
        )
    })
