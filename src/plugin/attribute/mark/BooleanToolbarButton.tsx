import {ReactEditor, useSlate} from "slate-react";
import React from "react";

import {RichSlateToolbarIconButton} from "@/component/toolbars/RichSlateToolbarIconButton.tsx";
import {BooleanTextMarkPlugin} from "../../BooleanTextMarkPlugin.tsx";
import HotKey from "@/lib/HotKey.ts";

type BooleanPluginAttribute = { booleanMarkPlugin: BooleanTextMarkPlugin };
/**
 * The toolbar button
 * It lives in the plugin object to use the `this` keyword
 * We could create the button outside the plugin,
 * but we would need to adapt it to pass the name (to be used with {@useRichSlatePlugin}) or the plugin object
 */
export const BooleanToolbarButton = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement> & BooleanPluginAttribute>(
    ({booleanMarkPlugin, ...props}, ref: React.Ref<HTMLButtonElement>): React.ReactElement => {

        /**
         * useSlate to render each time that the state changes
         * so that the active property is modified
         */
        const editor = useSlate() as ReactEditor;

        const hotKey = HotKey.toHumanDescription(booleanMarkPlugin.getHotKey());

        return (
            <RichSlateToolbarIconButton
                {...props}
                ref={ref}
                selected={booleanMarkPlugin.isBooleanMarkActive(editor)}
                iconName={booleanMarkPlugin.getCommandIconName()}
                title={`${booleanMarkPlugin.getName()} (${hotKey})`}
                onMouseDown={(event: React.MouseEvent) => {
                    event.preventDefault()
                    booleanMarkPlugin.toggleBooleanMark(editor)
                }}/>
        )

    }
)
