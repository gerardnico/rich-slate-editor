import styles from "./toolbar.module.css";
import React from "react";
import {cn} from "@/lib/utils.ts";


export function RichSlateToolBarIndicator(props: React.HTMLAttributes<HTMLDivElement>) {

    return (
        <div {...props} className={cn(styles.toolbarIndicator, props.className)}>
            {props.children}
        </div>
    )

}
