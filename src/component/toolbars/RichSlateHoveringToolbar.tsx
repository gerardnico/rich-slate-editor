import {ReactEditor, useSlate} from "slate-react";
import {useRichSlate} from "../context/useRichSlate";
import {HoveringToolbar} from "@/component/hoveringToolbar/HoveringToolbar.tsx";


export function RichSlateHoveringToolbar() {

    const editor = useSlate() as ReactEditor;
    const richSlate = useRichSlate();
    const shouldOpen = () => {

        /**
         * We use the native dom selection because
         * by injecting it, the selection of Slate is just off
         */
        let domSelection = window.getSelection();
        if (domSelection == null) {
            // no selection
            return false;
        }
        if (domSelection.isCollapsed) {
            // Collapsed selection (ie only cursor)
            return false;
        }
        let isEmpty = domSelection.toString() === '';
        if (isEmpty) {
            // Selection Is Empty string
            return false;
        }
        let editorDom = ReactEditor.toDOMNode(editor, editor);
        return editorDom.contains(domSelection.anchorNode);


    }
    return (
        <HoveringToolbar shouldOpen={shouldOpen}>
            {[...richSlate.getHoveringToolbarButtons().entries()].map(([toolbarPlugin, buttons]) => {
                return buttons
                    .map((ToolbarButton, index) => {
                        return <ToolbarButton key={`${toolbarPlugin.getName()}-${index}`}/>
                    })
            })}
        </HoveringToolbar>
    );
}
