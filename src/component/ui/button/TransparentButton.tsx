import React, {forwardRef} from "react";
import {ActionButtonType} from "./ActionButton.tsx";
import {cn} from "@/lib/utils.ts";


/**
 * A transparent button used as a container
 * (on list of toolbar icon, ...)
 * @param children
 * @param rest
 * @constructor
 */
export const TransparentButton = forwardRef<HTMLButtonElement, ActionButtonType>(
    function ({children, ...rest}: React.ButtonHTMLAttributes<HTMLButtonElement>, ref) {
        return (
            <button
                ref={ref}
                {...rest}
                className={cn("border-0", rest.className)}>
                {children}
            </button>
        );
    });
