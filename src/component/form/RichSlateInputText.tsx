import React from "react";
import {RichSlate} from "../../RichSlate.tsx";
import {RichSlateEditable} from "../rich-slate/RichSlateEditable.tsx";
import {RichSlateEditor, RichSlateEditorProps} from "../rich-slate/RichSlateEditor.tsx";
import styles from "./rich-slate-form.module.css"
import InputText from "@/component/ui/form/InputText.tsx";

/**
 * An element that replace an input of type text.
 * It gets extra styling to have the same rendering as an input text
 *
 * @param richSlate - the rich slate
 * @param placeholder - the placeholder
 * @param label - the label
 * @param children - optional buttons (as children because they must be inside Slate)
 * @param props - the props
 * @constructor
 */
export const RichSlateInputText = function ({
                                                richSlate,
                                                placeholder,
                                                label,
                                                children: buttons,
                                                ...props
                                            }: Omit<RichSlateEditorProps, 'richSlate'> & {
    placeholder: string,
    richSlate?: RichSlate,
    label: React.ReactNode
}) {

    if (richSlate === undefined) {
        return (
            <>
                {label}
                <InputText loading={true} placeholder={placeholder}/>
            </>
        )
    }


    return (
        <RichSlateEditor
            richSlate={richSlate}
            {...props}
        >
            <div>
                {label}{' '}
                <span style={
                    {
                        verticalAlign: 'middle',
                        backgroundColor: 'inherit'
                    }
                }>{buttons}
                </span>
            </div>
            <RichSlateEditable
                className={'mb-3 form-control ' + styles.richSlateEditable}
                placeholder={placeholder}
            />
        </RichSlateEditor>
    )

}
