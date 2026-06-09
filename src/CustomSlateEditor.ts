/**
 * Static function (ie command)
 * As explained here: https://docs.slatejs.org/concepts/08-plugins
 */

import {BaseEditor, Editor, Node, Transforms} from 'slate'
import {ReactEditor} from "slate-react";
import {HistoryEditor} from "slate-history";
import {BoldSlateEditor} from "./plugin/attribute/mark/BoldMarkPlugin.tsx";


export type CustomSlateEditorType = BaseEditor & ReactEditor & HistoryEditor & BoldSlateEditor
export const CustomSlateEditor = {
    ...Editor,
    isModelEditor(value: any): value is CustomSlateEditorType {
        return Editor.isEditor(value);
    },

    getSelectedText: function (editor: ReactEditor) {
        return editor.selection ? Editor.string(editor, editor.selection) : ""
    },
    /**
     * Find the lowest block that contains all the current selection
     * (ie common ancestor)
     * https://docs.slatejs.org/concepts/03-locations at the end
     */
    getCommonBlock: function (editor: ReactEditor) {

        // @ts-ignore
        const range = Editor.unhangRange(editor, editor.selection, {voids: true})

        let [common, path] = Node.common(
            editor,
            range.anchor.path,
            range.focus.path
        )

        // @ts-ignore
        if (Editor.isBlock(editor, common) || Editor.isEditor(common)) {
            return [common, path]
        } else {
            return Editor.above(editor, {
                at: path,
                // @ts-ignore
                match: n => Editor.isBlock(editor, n) || Editor.isEditor(n),
            })
        }
    },
    async selectAll(editor: Editor) {
        Transforms.select(editor, [])
    }
}
