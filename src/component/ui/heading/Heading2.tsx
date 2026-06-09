import styles from './heading.module.css'
import React from "react";
import {cn} from "@/lib/utils.ts";

export function Heading2({children, ...rest}: React.HTMLAttributes<HTMLHeadingElement>) {

    return (
        <h2 {...rest}
            className={cn('mb-3', 'h2', styles.heading, rest.className)}
        >
            {children}
        </h2>
    )

}
