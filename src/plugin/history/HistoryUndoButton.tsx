import React from "react";
import {useSlateStatic} from "slate-react";
import {HistoryEditor} from "slate-history";
import {RichSlateToolbarIconButton} from "../../component/toolbars/RichSlateToolbarIconButton.tsx";
import {UNDO_HOT_KEY} from "./HistoryPlugin";
import HotKey from "@/lib/HotKey.ts";


export const HistoryUndoButton = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLElement>>(
    (props: React.HTMLAttributes<HTMLElement>, ref: React.Ref<HTMLButtonElement>): React.ReactElement => {

        /**
         * State static as we don't need to re-render
         */
        const slateEditor = useSlateStatic() as HistoryEditor;
        const hotkey = HotKey.toHumanDescription(UNDO_HOT_KEY);
        return (
            <RichSlateToolbarIconButton
                {...props}
                ref={ref}
                title={`Undo (${hotkey})`}
                selected={false}
                iconName={'undo'}
                onClick={slateEditor.undo}
            />
        )

    }
)
