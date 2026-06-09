import {BooleanBlockElementPlugin} from "../../../BooleanBlockElementPlugin.tsx";
import {ReactEditor, useSlate} from "slate-react";
import {RichSlateToolbarIconButton} from "../../../../component/toolbars/RichSlateToolbarIconButton.tsx";
import React from "react";

type BooleanBlockPluginAttribute = { booleanBockPlugin: BooleanBlockElementPlugin };
/**
 * This component lives in the class
 * to be able to use this and to refer to it without passing the plugin
 */
export const BooleanBlockToolbarButton = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement> & BooleanBlockPluginAttribute>(
    ({booleanBockPlugin: booleanBlockPlugin, ...props}, ref): React.ReactElement => {
        /**
         * useSlate is a React state and rerender on every state change
         * (It permits to change the active state)
         */
        const editor = useSlate() as ReactEditor
        return (
            <RichSlateToolbarIconButton
                {...props}
                ref={ref}
                data-test-id={booleanBlockPlugin.getName()}
                selected={booleanBlockPlugin.isSelected(editor)}
                title={booleanBlockPlugin.getName()}
                iconName={booleanBlockPlugin.getIcon()}
                onClick={(event: React.MouseEvent) => {
                    event.preventDefault()
                    booleanBlockPlugin.toggle(editor)
                }}
            >
            </RichSlateToolbarIconButton>
        )
    })
