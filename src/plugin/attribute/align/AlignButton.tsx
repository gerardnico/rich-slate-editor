import React, {useCallback} from "react";
import {ReactEditor, useSlate} from "slate-react";
import {RichSlateToolbarIcon} from "@/component/toolbars/RichSlateToolbarIcon.tsx";
import styles from '../../../component/toolbars/toolbar.module.css'
import {AlignPlugin, AlignValue} from "./AlignPlugin";
import {useRichSlatePlugin} from "@/component/context/useRichSlatePlugin.ts";
import {dynamicButtonStyle} from "@/component/toolbars/RichSlateToolbarIconButton.tsx";
import {FloatingSelect} from "@/component/ui/select/FloatingSelect/FloatingSelect.tsx";
import {FloatingSelectOption} from "@/component/ui/select/FloatingSelect/FloatingSelectOption.tsx";

/**
 * Toolbar button component
 */
const ToolbarButtonLabelComponent = ({label}: { label: string }) => (
    <RichSlateToolbarIcon iconName={`align-${label}`}/>
);

export function AlignButton(props: React.HTMLAttributes<HTMLButtonElement>) {
    /**
     * useSlate to render each time that the state changes
     * so that the active property is modified
     */
    const editor = useSlate() as ReactEditor;
    const alignPlugin = useRichSlatePlugin<AlignPlugin>(AlignPlugin.NAME);


    if (alignPlugin === undefined) {
        return <p>Align Plugin is not enabled</p>
    }

    const actualLabel = alignPlugin.getSelectedAttributeValue(editor) as AlignValue | undefined;
    /**
     * The callback when a label value is chosen
     */
    let onSelectedLabel = useCallback((label: string | null) => {
        if (label === null || label === actualLabel) {
            alignPlugin.unsetProperty(editor);
            return;
        }
        alignPlugin.setProperty(editor, label)
    }, [actualLabel]);


    /**
     * The applied label value
     */
    const appliedLabel: AlignValue = actualLabel ? actualLabel : alignPlugin.getDefaultValue();


    return (
        <FloatingSelect selectedLabel={appliedLabel}
                        onSelectedLabel={onSelectedLabel}
                        className={styles.toolbarButton}
                        title={`Align ${appliedLabel}`}
                        ButtonLabelComponent={ToolbarButtonLabelComponent}
                        floatingArgumentProps={{
                            className: `${styles.toolbar} ${styles.toolbarFloating}`
                        }}
                        style={{
                            ...props.style,
                            ...dynamicButtonStyle({selected: actualLabel !== undefined})
                        }}
                        {...props}>
            {alignPlugin.getValues().map(label => {
                return (
                    <FloatingSelectOption key={label}
                                          label={label}
                                          title={`Align ${label}`}
                                          className={styles.toolbarButton}
                                          style={{
                                              ...props.style,
                                              ...dynamicButtonStyle({selected: label === actualLabel})
                                          }}
                    >
                        <RichSlateToolbarIcon iconName={`align-${label}`}/>
                    </FloatingSelectOption>
                )
            })}
        </FloatingSelect>
    )

}
