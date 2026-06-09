import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    FloatingList,
    offset,
    size,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useListNavigation,
    useRole,
    useTypeahead
} from "@floating-ui/react";
import React, {ButtonHTMLAttributes, HTMLAttributes, ReactElement, useCallback, useMemo, useRef, useState} from "react";
import {FloatingSelectOption} from "./FloatingSelectOption.tsx";
import {FloatingSelectContext} from "./FloatingSelectContext.ts";
import {ZIndex} from "@/lib/Zindex.ts";
import {cn} from "@/lib/utils.ts";



type FloatingSelectType = {
    /**
     * The actual label
     */
    selectedLabel?: string | null,
    /**
     * The on set callback
     * (null because you may have a null option)
     */
    onSelectedLabel?: (label: string | null) => void,
    /**
     * A function component for the label
     * in the button
     * By default, the label string
     */
    ButtonLabelComponent?: React.FC<{ label: string }>,
    /**
     * The children should be options
     */
    children: ReactElement<typeof FloatingSelectOption>[],
    /**
     * The props for the floating element
     */
    floatingArgumentProps?: HTMLAttributes<HTMLDivElement>
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * A select component that excepts option components.
 *
 * Example:
 * <code>
 * <FloatingSelect>
 *     <FloatingSelectOption label={'label1'}/>
 *     <FloatingSelectOption label={'label2'}/>
 *     <FloatingSelectOption label={'label3'}>
 *          <b>Label3</b>
 *     </FloatingSelectOption>
 * </FloatingSelect>
 * </code>
 *
 * All elements are buttons.
 *
 * @param options - the options to show
 * @constructor
 * A wrapper around the useListNavigation of Floating-ui
 * @see https://floating-ui.com/docs/uselistnavigation
 *
 * Adaptation of
 * https://codesandbox.io/p/sandbox/floating-ui-react-select-with-composable-children-qsuw76?file=%2Fsrc%2FApp.tsx%3A10%2C15
 */
export function FloatingSelect({
                                   selectedLabel,
                                   onSelectedLabel,
                                   ButtonLabelComponent,
                                   floatingArgumentProps,
                                   children,
                                   ...props
                               }: FloatingSelectType) {

    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    /**
     * useFloating main entry
     */
    const {refs, floatingStyles: floatingUiPositionStyles, context} = useFloating({
        placement: "bottom-start",
        open: isOpen,
        onOpenChange: setIsOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            // Translates the floating element along the specified placement axes.
            // https://floating-ui.com/docs/offset#offset
            offset(5),
            // flip vertically if no more in view
            flip({padding: 10}),
            // change the size of a floating element.
            // https://floating-ui.com/docs/size
            size({
                apply({rects, elements, availableHeight}) {
                    Object.assign(elements.floating.style, {
                        maxHeight: `${availableHeight}px`,
                        minWidth: `${rects.reference.width}px`
                    });
                },
                padding: 10
            }),
        ]
    });

    /**
     * Array of HTML elements
     */
    const listItemRefs = useRef<Array<HTMLElement | null>>([]);
    /**
     * Array of labels
     * (String null type is mandatory for the labels definition in the floating library typeahead)
     */
    const labelsRef = useRef<Array<string | null>>([]);

    const isTypingRef = useRef(false);

    /**
     * Interactions
     */
    const click = useClick(context, {event: "mousedown"});
    const dismiss = useDismiss(context);
    const role = useRole(context, {role: "listbox"});
    const listNav = useListNavigation(context, {
        listRef: listItemRefs,
        activeIndex,
        selectedIndex,
        onNavigate: setActiveIndex,
        // This is a large list, allow looping.
        loop: true
    });
    const typeahead = useTypeahead(context, {
        listRef: labelsRef,
        activeIndex,
        selectedIndex,
        onMatch: isOpen ? setActiveIndex : setSelectedIndex,
        onTypingChange(isTyping) {
            isTypingRef.current = isTyping;
        }
    });

    /**
     * Merges an array of interaction hooks' props into prop getters,
     * allowing event handler functions to be composed together without overwriting one another.
     */
    const {
        getReferenceProps,
        getFloatingProps: getFloatingUiProps,
        getItemProps
    } = useInteractions([dismiss, role, listNav, typeahead, click]);

    /**
     * Handle the selection of option
     */
    const handleSelect = useCallback((index: number | null) => {
        setSelectedIndex(index);
        setIsOpen(false);
        if (index !== null && onSelectedLabel !== undefined) {
            onSelectedLabel(labelsRef.current[index]);
        }
    }, [onSelectedLabel]);

    /**
     * The context that the options can use
     */
    const selectContext = useMemo(
        () => ({
            activeIndex,
            selectedIndex,
            getItemProps,
            handleSelect
        }),
        [activeIndex, selectedIndex, getItemProps, handleSelect]
    );

    /**
     * The default label component
     */
    if (!ButtonLabelComponent) {
        ButtonLabelComponent = ({label}) => {
            return <div style={{width: 150, lineHeight: 2, margin: "auto"}}>{label}</div>
        }
    }

    /**
     * The default styling of the floating div
     */
    if (floatingArgumentProps == undefined) {
        floatingArgumentProps = {
            style: {
                outline: 0,
                backgroundColor: "grey",
                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
                padding: 3,
                borderRadius: '10%',
            }
        }
    }


    return (
        <>
            {/*Creating the reference*/}
            <button
                {...props}
                tabIndex={0}
                ref={refs.setReference}
                aria-labelledby="select-label"
                aria-autocomplete="none"
                {...getReferenceProps()}
                className={cn(props.className, 'dropdown-toggle')}
            >
                <ButtonLabelComponent label={selectedLabel ? selectedLabel : 'Select...'}/>
            </button>
            {/*The floating element*/}
            {isOpen && (
                <FloatingSelectContext.Provider value={selectContext}>
                    <FloatingFocusManager context={context} modal={false}>
                        <div
                            ref={refs.setFloating}
                            {...floatingArgumentProps}
                            {...getFloatingUiProps()}
                            style={{
                                zIndex: ZIndex.DROPDOWN,
                                ...floatingArgumentProps.style,
                                ...floatingUiPositionStyles
                            }}
                        >
                            <FloatingList elementsRef={listItemRefs} labelsRef={labelsRef}>
                                {children}
                            </FloatingList>
                        </div>
                    </FloatingFocusManager>
                </FloatingSelectContext.Provider>
            )}
        </>
    );
}
