import React, {ButtonHTMLAttributes} from "react";
import {useListItem} from "@floating-ui/react";
import {FloatingSelectContext} from "./FloatingSelectContext.ts";

/**
 *
 * @param label - the label (used in typeahead and to index this options)
 * @param props - button props
 * @constructor
 */
export function FloatingSelectOption({
                                         label,
                                         ...props
                                     }: ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string,
    /**
     * A function component for the button
     * (By default, a button)
     */
    ButtonComponent?: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.HTMLAttributes<HTMLButtonElement>> & React.RefAttributes<HTMLButtonElement>> | 'button',
}) {
    const {
        activeIndex,
        selectedIndex,
        getItemProps,
        handleSelect
    } = React.useContext(FloatingSelectContext);

    /**
     * This Hook is used to register a list item and its index (DOM position) in the FloatingList
     * The optional label prop is used to determine the string that can be matched with typeahead
     */
    const {ref, index} = useListItem({label});

    /**
     * With floating ui, the active element is tracked
     * Technically, when using the mouse, it is also the hover element
     * but when using the keyboard, it's the active one
     */
    const isActive = activeIndex === index;
    const isSelected = selectedIndex === index;

    return (
        <button
            ref={ref}
            role="option"
            aria-selected={isActive && isSelected}
            tabIndex={isActive ? 99 : -1}
            {...getItemProps({
                onClick: () => handleSelect(index)
            })}
            {...props}
        >
            {!props.children ? label : props.children}
        </button>
    );
}
