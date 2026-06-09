import React from "react";

/**
 * Group buttons together
 * @param children - must be of button type or HTML anchor styled
 * @param props - div props
 * @constructor
 */
export function ButtonGroup({children, ...props}: React.HTMLAttributes<HTMLDivElement>) {

    return (
        <div className={'btn-group flex-wrap'} {...props}>
            {children}
        </div>
    )
}
