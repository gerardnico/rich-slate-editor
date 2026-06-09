import {HTMLProps, useEffect} from "react";
import {
    autoUpdate,
    flip,
    FloatingPortal,
    inline,
    offset,
    useFloating,
    useInteractions,
    useRole,
    VirtualElement
} from "@floating-ui/react";


type VirtualListProps = {
    // The virtual element to position the list
    virtualElement: VirtualElement;
} & HTMLProps<HTMLUListElement>


/**
 * A virtual list used in autocompletion when typing in a text area
 *
 * Because the key events are managed by the text area, there is no focus, typeahead, dismiss or onOpenChange callback functionality at all
 *
 * For styling, the controller is responsible for keeping the active element
 * and needs to pass the active to the children directly.
 *
 */
export const VirtualList = function ({
                                         virtualElement,
                                         children,
                                         ...props
                                     }: VirtualListProps) {


    /**
     * useFloating() is the main entry of Floating UI in React
     *
     * It:
     * * accepts all the options from computePosition
     * * returns all the values from computePosition + some extras to work with React.
     *
     * https://floating-ui.com/docs/react#positioning
     * Avoid useFloating with a big list because it will render the host on every scroll or resize event
     */
    const {
        /**
         * refs returns two refs:
         * * refs.setReference for the anchor
         * * refs.setFloating for the overlay / host
         */
        refs,
        /**
         * floatingStyles is an object of positioning styles to apply to the floating element’s style prop
         */
        floatingStyles,
        /**
         * A context object used by other hooks
         */
        context
    } = useFloating({
        /**
         * At the start of the variable (range)
         */
        placement: 'bottom-start',
        /**
         * by default, open is considered false,
         * but it's a controlled component
         * (meaning that it's shown conditionally)
         */
        open: true,
        middleware: [
            inline(),
            offset({
                // margin
                mainAxis: 5
            }),
            flip({
                padding: 10
            })
        ],
        elements: {
            reference: virtualElement as Element,
        },
        /**
         * autoUpdate: To ensure the floating element remains anchored to its reference element
         * https://floating-ui.com/docs/react#anchoring
         */
        whileElementsMounted: autoUpdate
    });

    useEffect(() => {
        /**
         * Update the refs
         */
        refs.setPositionReference(virtualElement)
    }, [refs, virtualElement]);


    /**
     * returns ARIA attribute props
     */
    const role = useRole(context, {role: "listbox"});


    /**
     * It accepts an array of interaction hooks
     * and returns props
     *
     */
    const {
        getFloatingProps, // props/attribute for the floating list
    } = useInteractions([
        role // arial
    ]);


    return (
        /**
         * A React Portal for floating element
         */
        <FloatingPortal>
            <ul
                {...props}
                className="dropdown-menu show focus-ring-light"
                tabIndex={-1}
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
            >
                {children}
            </ul>
        </FloatingPortal>
    );
}
