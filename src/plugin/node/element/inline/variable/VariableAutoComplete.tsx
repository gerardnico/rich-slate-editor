import React, {useEffect, useMemo, useRef, useState} from "react";
import {useRichSlatePlugin} from "@/component/context/useRichSlatePlugin.ts";
import {VariablePlugin, VariableType} from "./VariablePlugin.tsx";
import {Range as SlateRange, Transforms} from "slate";
import {ReactEditor, useSlateStatic} from "slate-react";
import {useRichSlateChangeSubscription} from "@/component/context/useRichSlateChangeSubscription.ts";
import {useRichSlateKeyDownSubscription} from "@/component/context/useRichSlateKeyDownSubscription.ts";
import {VirtualElement} from "@floating-ui/react";
import {VirtualList} from "@/component/ui/virtual-list/VirtualList.tsx";
import {VirtualListItem} from "@/component/ui/virtual-list/VirtualListItem.tsx";


/**
 * A list of choice that opens in the editor
 * when the writer types the $ sign
 * Adapted from
 * https://github.com/ianstormtaylor/slate/blob/main/site/examples/mentions.tsx
 * @constructor
 */
export function VariableAutoComplete() {

    const [slateRange, setSlateRange] = useState<SlateRange | null>(null)
    // the slate range and the dom range are not in sync until React as rendered
    // And you may get - cannot resolve a DOM point from Slate point
    // we therefore calculate the domRange in an effect
    const [domRange, setDomRange] = useState<Range | null>(null)
    const [searchTerm, setSearchTerm] = useState<string | null>(null)
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const variablePlugin = useRichSlatePlugin<VariablePlugin>(VariablePlugin.NAME);

    /**
     * Ref for closure
     * (not stale closure due to state variable not keeping their reference)
     */
    const targetRangeRef = useRef<SlateRange | null>(slateRange);
    const variableListRef = useRef<VariableType[]>([]);
    const activeIndexRef = useRef<number>(activeIndex);

    /**
     * useSlate static does not re-render on every state change
     */
    const editor = useSlateStatic() as ReactEditor;

    /**
     * List for selection
     */
    let autoCompleteVariablesList: VariableType[] = useMemo(() => {
        let returnedVariables = Object.values(variablePlugin.getVariables());
        if (searchTerm !== null) {
            returnedVariables = returnedVariables
                .filter(c => c.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
                .sort((v1, v2) => v1.name.localeCompare(v2.name));
        }
        return returnedVariables.slice(0, 10);
    }, [searchTerm]);


    /**
     * Key navigation to change the active element (visually, no focus is changed)
     * Why ref?
     * SetState create a new reference for the state variable, creating a stale closure.
     * (ie the variable is the first reference (ie null for target and the 10 first variable names)
     * We use therefore a ref to keep the reference.
     */
    targetRangeRef.current = slateRange;
    variableListRef.current = autoCompleteVariablesList;
    activeIndexRef.current = activeIndex;
    useRichSlateKeyDownSubscription(variablePlugin, 'autocomplete', function (event: React.KeyboardEvent) {
        const closureTargetRange = targetRangeRef.current;
        const closureVariableList = variableListRef.current;
        const closureIndex = activeIndexRef.current;
        if (closureTargetRange && closureVariableList.length > 0) {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault()
                    const prevIndex = closureIndex >= closureVariableList.length - 1 ? 0 : closureIndex + 1
                    setActiveIndex(prevIndex)
                    break
                case 'ArrowUp':
                    event.preventDefault()
                    const nextIndex = closureIndex <= 0 ? closureVariableList.length - 1 : closureIndex - 1
                    setActiveIndex(nextIndex)
                    break
                case 'Tab':
                case 'Enter':
                    event.preventDefault()
                    Transforms.select(editor, closureTargetRange)
                    variablePlugin.insertVariable(editor, closureVariableList[closureIndex].id)
                    setSlateRange(null)
                    break
                case 'Escape':
                    event.preventDefault()
                    setSlateRange(null)
                    break
            }
        }
    })


    /**
     * Listen to change to detect variable words
     */
    useRichSlateChangeSubscription(variablePlugin, () => {

        const {range, match} = variablePlugin.detectVariableAtCurrentSelection(editor);

        if (!range) {
            setSlateRange(null)
            return
        }
        setSlateRange(range)
        setSearchTerm(match ? match : '')

    })


    /**
     * The Slate Range may be not yet synchronized with the DOM Range
     * (it happens on KeyDown, the letter is captured but not yet rendered)
     * leading to
     * `Cannot resolve a DOM point from Slate point: {"path":[1,0],"offset":1}`
     * We need to wait a rendering
     */
    useEffect(() => {
        try {
            if (slateRange == null) {
                setDomRange(null);
                return;
            }
            const domRange = ReactEditor.toDOMRange(editor, slateRange)
            setDomRange(domRange)
        } catch (e) {
            setDomRange(null)
            // Cannot resolve a DOM point from Slate point: {"path":[1,0],"offset":1}
            console.error(e);
        }
    }, [slateRange]);

    /**
     * Open the list portal?
     */
    const isOpen = domRange != null && slateRange != null && autoCompleteVariablesList.length > 0;
    if (!isOpen) {
        return;
    }

    const boundingClientRect = domRange.getBoundingClientRect();
    const clientRects = domRange.getClientRects();
    /**
     * Don't return the function, otherwise when deleting a character backward,
     * the floating element position is 0.
     * ie don't do,
     * getBoundingClientRect: ()=>domRange.getBoundingClientRect()
     * but passes the coordinates as below
     */
    const virtualElement = {
        getBoundingClientRect: () => {
            return {
                "x": boundingClientRect.x,
                "y": boundingClientRect.y,
                "width": boundingClientRect.width,
                "height": boundingClientRect.height,
                "top": boundingClientRect.top,
                "right": boundingClientRect.right,
                "bottom": boundingClientRect.bottom,
                "left": boundingClientRect.left
            }
        },
        getClientRects() {
            const localClientsRects = [];
            for (const clientRect of clientRects) {
                localClientsRects.push({
                    width: clientRect.width,
                    height: clientRect.height,
                    x: clientRect.x,
                    y: clientRect.y,
                    top: clientRect.top,
                    right: clientRect.right,
                    bottom: clientRect.bottom,
                    left: clientRect.left
                })
            }
            return localClientsRects;
        }
    } as VirtualElement;

    /**
     * List
     */
    return (
        <VirtualList virtualElement={virtualElement}>
            {autoCompleteVariablesList.map((variable, i) => (
                <VirtualListItem
                    key={variable.id}
                    onClick={() => {
                        Transforms.select(editor, slateRange)
                        variablePlugin.insertVariable(editor, variable.id)
                        setSlateRange(null)
                    }}
                    active={activeIndex === i}>
                    {variable.name}
                </VirtualListItem>
            ))}
        </VirtualList>
    )

}
