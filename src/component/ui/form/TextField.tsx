import React from "react";

import {cn} from "@/lib/utils.ts";
import LoadingSpan from "@/component/ui/loading/LoadingSpan.tsx";

type TextFieldType = React.HTMLAttributes<HTMLSpanElement> & {
    loading?: boolean,
    width?: number,
    bold?: boolean,
    italic?: boolean
};

/**
 * A span with a loading and typographic effect.
 * It will pulse if the children are undefined or the loading props is true
 *
 * It's called Typography (ie Material UI, ...)
 *
 */
export function TextField({
                              loading,
                              bold,
                              italic,
                              children,
                              width = 150,
                              ...props
                          }: TextFieldType) {


    if (loading === undefined) {
        loading = children === undefined;
    }

    if (loading) {
        return <LoadingSpan {...props} width={width}>{children}</LoadingSpan>
    }

    return (
        <span
            className={
                cn(
                    italic ? 'fst-italic' : undefined,
                    bold ? 'fw-bold' : undefined,
                    props.className
                )
            }
            {...props}
        >{children}
        </span>
    )

}
