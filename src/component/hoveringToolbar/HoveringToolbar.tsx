/**
 * Taken from the example (https://codesandbox.io/s/trusting-rui-2duieo?file=/src/ContextMenu.tsx)
 * adapted, and commented
 */
import {
    ButtonHTMLAttributes,
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    PropsWithChildren,
    useEffect,
    useRef,
    useState
} from "react";
import {
    autoUpdate,
    flip,
    FloatingPortal,
    inline,
    offset,
    shift,
    useDismiss,
    useFloating,
    useInteractions,
    useListNavigation,
    useRole,
    useTypeahead,
    VirtualElement
} from "@floating-ui/react";

const classNameToolbar = 'HoveringToolbar';
const classNameToolbarItem = 'HoveringToolbarItem'

export const HoveringToolbarItem = forwardRef<
        HTMLButtonElement,
        ButtonHTMLAttributes<HTMLButtonElement> & {
        label: string;
        disabled?: boolean;
    }
    >(
        ({label, disabled, ...props}, ref) => {

            return (
                <button
                    {...props}
                    className={classNameToolbarItem}
                    ref={ref}
                    role="menuitem"
                    disabled={disabled}
                >
                    {label}
                </button>
            );
        }
    )
;


/**
 *
 * @param shouldOpen - a trigger function (by default the toolbar open if there is a range selection)
 * @param children - the menu item
 * @param props - any other props
 * @constructor
 */
export const HoveringToolbar = ({shouldOpen, children, ...props}: PropsWithChildren & {
    shouldOpen?: () => boolean,
    getListenerElement?: () => HTMLElement
}) => {

    /**
     * The index of the active element in the list array
     * If 0, the first element is the active one
     */
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    /**
     * If the menu is shown (open)
     */
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Array of the HTML elements creating the list
     */
    const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);

    /**
     * Array of the HTML elements holding the content (wrap by a list element)
     */
    const listContentRef = useRef(
        Children.map(
            children,
            (child) => isValidElement(child) ? child.props.label : null
        ) as Array<string | null>
    );

    /**
     * Style
     * They are all added here because there is only
     * one hoveringToolbar node and therefore there is only
     * one style element added into the head
     * Because of the null array dependencies, it's only executed once when mounting
     */
    useEffect(() => {

        const head = document.head;
        const style = document.createElement("style");
        style.classList.add('hovering-toolbar')

        style.textContent = `
.${classNameToolbar} {
    outline: 0;
    background: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 3px;
    border-radius: 8px;
}
.${classNameToolbarItem} {
    background: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    text-align: left;
    line-height: 1.5;
    margin: 0;
    outline: 0;
}

.${classNameToolbarItem}.open {
    background: #ddd;
}

.${classNameToolbarItem}:focus,
.${classNameToolbarItem}:not([disabled]):active {
    background: royalblue;
    color: white;
}
`

        head.appendChild(style);

        return () => {
            head.removeChild(style);
        }

    }, []);


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
    } =
        useFloating({
            open: isOpen,
            onOpenChange: setIsOpen,
            /**
             * In top by default
             */
            placement: "top",
            middleware: [
                // when the selection goes over multiple lines,
                // the toolbar stay attached to one edge
                // https://floating-ui.com/docs/inline
                inline(),
                // Translates the floating element along the specified placement axes.
                // https://floating-ui.com/docs/offset#offset
                offset(5),
                // flip vertically if no more in view
                flip(),
                // shift horizontally if no more in view
                shift({padding: 10})
            ],
            /**
             * Why ? Taken from the context menu example
             * https://floating-ui.com/docs/computeposition#strategy
             */
            strategy: "fixed",
            /**
             * autoUpdate: To ensure the floating element remains anchored to its reference element
             * https://floating-ui.com/docs/react#anchoring
             */
            whileElementsMounted: autoUpdate
        });

    /**
     * returns ARIA attribute props
     */
    const role = useRole(context, {role: "menu"});
    /**
     * Get a `dismiss` fonction to close the floating element when a dismissal is requested
     * By default, when the user presses the escape key or outside, of the floating element
     */
    const dismiss = useDismiss(context);

    /**
     * Adds key navigation on the list of items via the arrows
     * It returns event handler and ARIA attribute
     */
    const listNavigation = useListNavigation(context, {
        listRef: listItemsRef, // the array of HTML elements creating the list
        onNavigate: setActiveIndex,
        activeIndex,
        orientation: 'horizontal'
    });

    /**
     * When the user type, it will go directly to the list item
     * (used with useListNavigation)
     */
    const typeahead = useTypeahead(context, {
        enabled: isOpen,
        listRef: listContentRef, // the array of HTML elements creating the list
        onMatch: setActiveIndex,
        activeIndex
    });

    /**
     * It accepts an array of interaction hooks
     * and returns props
     *
     */
    const {
        getFloatingProps, // props/attribute for the floating list
        getItemProps // props for the list item
    } = useInteractions([
        role, // arial
        dismiss, // dismiss
        listNavigation, // navigate list by arrow
        typeahead // navigate list by letter
    ]);

    const domSelection = window.getSelection()
    let triggerFunction: () => boolean;
    if (typeof shouldOpen === 'undefined') {
        triggerFunction = function () {
            if (domSelection === null) {
                return false;
            }
            return !domSelection.isCollapsed;
        }
    } else {
        triggerFunction = shouldOpen;
    }

    /**
     * Run at the end of each rendering
     */
    useEffect(() => {


        /**
         * Context Menu listener (right click)
         */
        function onSelectChange(this: Document) {


            if (!triggerFunction()) {
                setIsOpen(false);
                return;
            }


            const domSelection = window.getSelection();
            if (domSelection === null) {
                setIsOpen(false);
                return;
            }
            const domRange = domSelection.getRangeAt(0)
            const rect = domRange.getBoundingClientRect()
            const clientRects = domRange.getClientRects()
            /**
             * Virtual Element
             */
            refs.setPositionReference({
                getBoundingClientRect: () => {
                    return {
                        width: rect.width,
                        height: rect.height,
                        x: rect.x,
                        y: rect.y,
                        top: rect.top,
                        right: rect.right,
                        bottom: rect.bottom,
                        left: rect.left
                    };
                },
                getClientRects: () => {
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
            } as VirtualElement);

            setIsOpen(true);

        }

        /**
         * Selection change event occurs only on document
         */
        document.addEventListener("selectionchange", onSelectChange);

        /**
         * Clean up function that runs
         * when the context menu is dismissed
         */
        return () => {
            document.removeEventListener("selectionchange", onSelectChange);
        };
    }, [refs, triggerFunction]);

    if (!isOpen) {
        return null;
    }

    /**
     * A React Portal for floating element
     */
    return (
        <FloatingPortal>
            {/*<FloatingFocusManager context={context} initialFocus={-1} order={['content', 'reference']} modal={false}*/}
            {/*                      closeOnFocusOut={false}>*/}
                <div
                    className={classNameToolbar}
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...props}
                    {...getFloatingProps()}
                >
                    {Children.map(
                        children,
                        (child, index) =>
                            isValidElement(child) &&
                            cloneElement(
                                child,
                                getItemProps({
                                        tabIndex: activeIndex === index ? 0 : -1,
                                        ref(node: HTMLButtonElement) {
                                            listItemsRef.current[index] = node;
                                        },
                                        onClick() {
                                            child.props.onClick?.();
                                        },
                                        onMouseUp() {
                                            child.props.onMouseUp?.();
                                        },
                                    }
                                )
                            ),
                    )}
                </div>
            {/*</FloatingFocusManager>*/}
        </FloatingPortal>
    )

}
