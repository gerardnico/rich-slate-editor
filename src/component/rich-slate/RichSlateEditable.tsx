import {Editable} from "slate-react";
import React, {useCallback} from "react";
import {EditableProps, RenderElementProps, RenderLeafProps} from "slate-react/dist/components/editable";
import {useRichSlate} from "../context/useRichSlate.ts";
import styles from "./rich-slate.module.css"

/**
 * Slate Editable wrapper
 */
export const RichSlateEditable = function (props: EditableProps) {

    const richSlate = useRichSlate();

    /**
     * Important for the callbacks
     * We use arrow callback function and not the function directly
     * to bind this to the class object (ie richSlate)
     */
    const renderElement = useCallback((props: RenderElementProps) => richSlate.renderElement(props), [])
    const renderLeaf = useCallback((props: RenderLeafProps) => richSlate.renderLeaf(props), [])
    const onKeyDown = useCallback((event: React.KeyboardEvent) => richSlate.onKeyDown(event), [])
    const onClick = useCallback((event: React.MouseEvent) => richSlate.onClick(event), [])
    const onDoubleClick = useCallback((event: React.MouseEvent) => richSlate.onDoubleClick(event), [])
    const onDomBeforeInput = useCallback((event: InputEvent) => richSlate.onDomBeforeInput(event), [])

    return <Editable
        spellCheck
        {...props}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onDOMBeforeInput={onDomBeforeInput}
        renderPlaceholder={({children, attributes}) => {
            /**
             * Customize the placeholder
             * The children React.ReactNode is the placeholder text in a P element
             * Styles is the Bootstrap placeholder styles (ie form-control::placeholder)
             * that you can see with the shadow dom option in Chrome
             */
            return (
                <span {...attributes} className={styles.placeholder}
                      style={{}}>
                    {children}
                </span>
            )
        }}

    />


}
