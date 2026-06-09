import styles from "./toolbar.module.css";
import React from "react";
import {RichSlateToolbarActionButtons} from "./RichSlateToolbarActionButtons.tsx";
import {DescendantStorageButton} from "../../plugin/persist/DescendantStorageButton.tsx";
import {StoragePlugin} from "@/plugin/StoragePlugin.ts";
import {LayoutHorizontal} from "@/component/ui/LayoutHorizontal.tsx";
import {cn} from "@/lib/utils.ts";


export function RichSlateToolbar({
                                     storagePlugin,
                                     ...props
                                 }: React.HTMLAttributes<HTMLDivElement> & { storagePlugin?: StoragePlugin }) {

    return (
        <LayoutHorizontal
            distribution={'between'}
            {...props}
            data-test-id="toolbar"
            className={cn('mb-2', 'rounded', 'p-1', styles.toolbar, props.className)}
        >
            <RichSlateToolbarActionButtons/>
            {storagePlugin && <DescendantStorageButton storagePlugin={storagePlugin}/>}
        </LayoutHorizontal>
    )
}
