import styles from './heading.module.css'
import React from "react";
import {cn} from "@/lib/utils.ts";

export function Heading1({children, ...rest}: React.HTMLAttributes<HTMLHeadingElement>) {


    return (
        <h1
            {...rest}
            className={cn("mb-3", "h1", styles.heading, rest.className)}
        >
            {children}
        </h1>
    )

}
