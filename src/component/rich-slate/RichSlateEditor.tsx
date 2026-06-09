import {Slate} from "slate-react";
import React, {useCallback, useMemo} from "react";
import {Descendant, Selection} from "slate";
import {RichSlateContext} from "../context/useRichSlate.ts";
import {RichSlate} from "../../RichSlate.tsx";
import {ErrorBoundary} from "../ui/failure/ErrorBoundary.tsx";
import {ErrorFallback} from "../ui/failure/ErrorFallback.tsx";

export type RichSlateEditorProps = {
    richSlate: RichSlate,
    initialValue?: Descendant[];
    children: React.ReactNode;
    onChange?: ((value: Descendant[]) => void) | undefined;
    onSelectionChange?: ((selection: Selection) => void) | undefined;
    onValueChange?: ((value: Descendant[]) => void) | undefined;
};

/**
 * The Rich Slate Editor is a wrapper around Slate
 * You can add Rich Slate children components to enrich the editor
 * @param children
 * @param richSlate
 * @param props
 * @constructor
 */
export function RichSlateEditor({children, richSlate, onChange, onValueChange, initialValue}: RichSlateEditorProps) {


    if (onChange !== undefined) {
        richSlate.addOnChangeHandler(null, onChange);
    }

    /**
     * Important for the callbacks
     * We use arrow callback function and not the function directly
     * to bind this to the class object (ie richSlate)
     */
    const onChangeCallback = useCallback((descendants: Descendant[]) => richSlate.onChange(descendants), [])

    const editor = useMemo(() => richSlate.getSlateEditor(), []);

    /**
     * Initial value may be set for test
     */
    if (initialValue == undefined) {
        /**
         * Storage plugin may be
         */
        initialValue = richSlate.getInitialValue();
    }


    /**
     * <Slate> is the context provider.
     * It:
     * * keeps track of the editor state (plugins, value, selection), and any changes that occur.
     * * provide the editor state to other components like toolbars, menus, etc... using the useSlate hook
     *
     * <Editable>: Render the editable. It acts like contenteditable;
     * It renders an editable RichText document for the nearest Slate editor context.
     *
     * Render Mode: Displaying content (with readOnly set to true)
     * When the Editor is set to readOnly, it is not editable
     * This is useful for scenarios where you want to render via Slate, without giving the user editing permissions.'
     * https://www.slatejs.org/examples/read-only
     */
    return (
        <ErrorBoundary fallback={ErrorFallback}>
            <RichSlateContext.Provider value={richSlate}>
                <Slate
                    editor={editor}
                    initialValue={initialValue}
                    onChange={onChangeCallback}
                    onValueChange={onValueChange}
                >
                    {children}
                    {/*
                        Portal components are not visible.
                        They are mandatory (ie keydown event, ...)
                        They are not part of the layout and are therefore here
                     */}
                    {[...richSlate.getPluginPortalComponents().entries()].map(([plugin, Components]) => {
                        return Components.map(
                            (Component, subIndex) =>
                                <Component key={`portal-component-${plugin.getName()}-${subIndex}`}/>)
                    })}
                </Slate>
            </RichSlateContext.Provider>
        </ErrorBoundary>
    )

}
