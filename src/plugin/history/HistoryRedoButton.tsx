import React from "react";
import {useSlateStatic} from "slate-react";
import {HistoryEditor} from "slate-history";
import {RichSlateToolbarIconButton} from "../../component/toolbars/RichSlateToolbarIconButton.tsx";
import {REDO_HOT_KEY} from "./HistoryPlugin";
import HotKey from "@/lib/HotKey.ts";

export const HistoryRedoButton = React.forwardRef <HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
    (props: React.HTMLAttributes<HTMLButtonElement>, ref: React.Ref<HTMLButtonElement>): React.ReactElement => {

        /**
         * State static as we don't need to re-render
         */
        const slateEditor = useSlateStatic() as HistoryEditor;
        const hotkey = HotKey.toHumanDescription(REDO_HOT_KEY);
        return (
            <RichSlateToolbarIconButton
                {...props}
                ref={ref}
                selected={false}
                title={`Redo (${hotkey})`}
                iconName={'redo'}
                onClick={slateEditor.redo}
            />
        )

    }
)
