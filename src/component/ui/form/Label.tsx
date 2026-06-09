import React from "react";

/**
 * A label used for a form
 * @param props - the label attributes
 * @constructor
 */
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
    // Bold so that in mobile we can distinguish them from the value
    return (
        <label className={'fw-bold form-label'} {...props}/>
    )
}
