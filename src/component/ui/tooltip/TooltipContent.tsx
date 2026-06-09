import * as React from "react";
import {FloatingPortal, useMergeRefs} from "@floating-ui/react";
import {useTooltipContext} from "./Tooltip.tsx";

import styles from "./tooltip.module.css"
import {cn} from "@/lib/utils.ts";
import {ZIndex} from "@/lib/Zindex.ts";



export type ToolTipContentType = React.HTMLProps<HTMLDivElement> & { maxWidth?: string };
export const TooltipContent = React.forwardRef<
    HTMLDivElement,
    ToolTipContentType
>(function ({maxWidth, style, children, ...props}, propRef) {
    const context = useTooltipContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);

    // uncomment this line to debug the style
    if (!context.open) return null;

    /**
     * With is on the inner
     */
    let innerStyle: React.CSSProperties = {}
    if (maxWidth !== undefined) {
        innerStyle = {
            maxWidth: maxWidth
        }
    }

    return (
        <FloatingPortal>
            <div
                ref={ref}
                role="tooltip"
                className={cn('tooltip', 'show', props.className)}
                style={{
                    ...style,
                    zIndex: ZIndex.TOOLTIP,
                    ...context.floatingStyles
                }}
                {...context.getFloatingProps(props)}
            >
                <div className={cn('tooltip-inner', styles.innerTooltip)} style={innerStyle}>
                    {children}
                </div>
            </div>
        </FloatingPortal>
    );
});
