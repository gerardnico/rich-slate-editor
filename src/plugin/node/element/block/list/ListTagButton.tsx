import React from "react";
import {ReactEditor, useSlate} from "slate-react";
import {RichSlateToolbarIconButton} from "../../../../../component/toolbars/RichSlateToolbarIconButton.tsx";
import {ListPlugin, ListTypeTag} from "./ListPlugin";
import {useRichSlatePlugin} from "../../../../../component/context/useRichSlatePlugin";


type ListTagButtonType = React.HTMLAttributes<HTMLButtonElement> & {
    tag: ListTypeTag
};
export const ListTagButton = React.forwardRef<HTMLButtonElement, ListTagButtonType>(
    function ({tag, ...props}: ListTagButtonType, ref: React.ForwardedRef<HTMLButtonElement>): React.ReactElement {

        /**
         * useSlate is a React state and rerender on every state change
         * (It permits to change the selected state)
         */
        const editor = useSlate() as ReactEditor
        const listPlugin = useRichSlatePlugin<ListPlugin>(ListPlugin.NAME);
        const selectedTag = listPlugin.isSelectedTag(editor, tag);
        const isList = listPlugin.isSelected(editor);
        return (
            <RichSlateToolbarIconButton
                {...props}
                ref={ref as React.Ref<HTMLButtonElement>}
                data-test-id={`list-${tag}`}
                selected={selectedTag}
                title={`${tag === ListPlugin.UL ? 'Bullet' : 'Ordered'} List`}
                iconName={`list-${tag}`}
                onClick={(event: React.MouseEvent) => {
                    event.preventDefault()
                    if (!selectedTag) {
                        if (isList) {
                            /**
                             * Other list type
                             */
                            listPlugin.deleteListItem(editor)
                            listPlugin.createList(editor, tag)
                            return;
                        }
                        listPlugin.createList(editor, tag)
                        return;
                    }
                    listPlugin.deleteListItem(editor)
                }}
            >
            </RichSlateToolbarIconButton>
        )
    })
