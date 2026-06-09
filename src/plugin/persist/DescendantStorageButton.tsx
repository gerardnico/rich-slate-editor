import {Descendant} from "slate";
import {useRichSlate} from "../../component/context/useRichSlate.ts";
import {useState} from "react";
import {RichSlateToolBarIndicator} from "../../component/toolbars/RichSlateToolbarIndicator.tsx";
import {RichSlateToolbarIcon} from "../../component/toolbars/RichSlateToolbarIcon.tsx";
import {StoragePlugin} from "../StoragePlugin.ts";


export type StorageButtonAttributes = { storagePlugin: StoragePlugin };

export function DescendantStorageButton({storagePlugin}: StorageButtonAttributes) {

    const richSlate = useRichSlate();
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    richSlate.addOnChangeHandler(storagePlugin, (descendant: Descendant[]) => {

        const editor = richSlate.getSlateEditor();
        const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
        )
        if (isAstChange) {
            const newTimer = setTimeout(() => {
                storagePlugin.store(descendant)
                setTimer(null);
            }, 3000)
            if (timer !== null) {
                clearTimeout(timer);
            }
            setTimer(newTimer);
        }

    })

    return (
        <RichSlateToolBarIndicator title={timer ? 'Saving Locally' : 'Saved Locally'}>
            {timer && <RichSlateToolbarIcon
                iconName={'arrow-bar-down'}
            />}
            {!timer && <RichSlateToolbarIcon
                iconName={'check2'}
            />}
            {' '}
            {timer ? 'Saving' : 'Saved'}
        </RichSlateToolBarIndicator>
    )


}
