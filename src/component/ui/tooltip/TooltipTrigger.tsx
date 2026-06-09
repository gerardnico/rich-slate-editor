import * as React from "react";
import {useMergeRefs} from "@floating-ui/react";
import {useTooltipContext} from "./Tooltip.tsx";

export const TooltipTrigger = React.forwardRef<
    HTMLElement,
    React.HTMLProps<HTMLElement> & { asChild?: boolean, inline?: boolean, children: React.ReactNode }
>(function TooltipTrigger({children, asChild = false, inline = true, ...props}, propRef) {
    const context = useTooltipContext();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const childrenRef = children.ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    // `asChild` allows the user to pass any element as the anchor
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(
            children,
            context.getReferenceProps({
                ref,
                ...props,
                ...children.props,
                "data-state": context.open ? "open" : "closed"
            })
        );
    }

    const triggerProps = {
        ref: ref,
        // The user can style the trigger based on the state
        "data-state": context.open ? "open" : "closed",
        ...context.getReferenceProps(props)
    };
    if (inline) {
        return React.createElement('span', triggerProps, children);
    } else {
        return React.createElement('button', triggerProps, children);
    }


});
