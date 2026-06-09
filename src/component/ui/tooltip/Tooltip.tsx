// https://codesandbox.io/p/sandbox/xenodochial-grass-js3bo9

import * as React from "react";
import type {Placement} from "@floating-ui/react";
import {
    autoUpdate,
    flip,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole
} from "@floating-ui/react";

interface TooltipOptions {
    initialOpen?: boolean;
    placement?: Placement;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function useTooltip({
                        initialOpen = false,
                        placement = "top",
                        open: controlledOpen,
                        onOpenChange: setControlledOpen
                    }: TooltipOptions = {}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);

    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;

    const data = useFloating({
        placement,
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(5),
            flip({
                crossAxis: placement.includes("-"),
                fallbackAxisSideDirection: "start",
                padding: 5
            }),
            shift({padding: 5})
        ]
    });

    const context = data.context;

    /**
     * Tooltip is shown on hover
     */
    const hover = useHover(context, {
        move: false,
        enabled: controlledOpen == null
    });
    const focus = useFocus(context, {
        enabled: controlledOpen == null
    });
    const dismiss = useDismiss(context);
    const role = useRole(context, {role: "tooltip"});

    const interactions = useInteractions([hover, focus, dismiss, role]);

    return React.useMemo(
        () => ({
            open,
            setOpen,
            ...interactions,
            ...data
        }),
        [open, setOpen, interactions, data]
    );
}

type ContextType = ReturnType<typeof useTooltip> | null;

export const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipContext = () => {
    const context = React.useContext(TooltipContext);

    if (context == null) {
        throw new Error("Tooltip components must be wrapped in <Tooltip />");
    }

    return context;
};

export function Tooltip({
                                     children,
                                     ...options
                                 }: { children: React.ReactNode } & TooltipOptions) {
    // This can accept any props as options, e.g. `placement`,
    // or other positioning options.
    const tooltip = useTooltip(options);
    return (
        <TooltipContext.Provider value={tooltip}>
            {children}
        </TooltipContext.Provider>
    );
}
