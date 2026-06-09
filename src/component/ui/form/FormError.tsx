import formStyles from './input-error.module.css'
import React from "react";

export type FormError = React.HTMLAttributes<HTMLDivElement> & { skin?: "tooltip" | "inline" };

export function FormError({skin = "inline", ...props}: FormError) {
    return (
        <div className={skin == "inline" ? formStyles.invalidFeedback : "invalid-tooltip"}>
            {props.children}
        </div>
    )
}
