import {forwardRef} from "react";
import {ActionButton, ActionButtonType} from "./ActionButton.tsx";


/**
 *
 * @param children - the label
 * @param className - the class name to style them (with css module)
 * @param fetching - the fetching state to show a spinner and disable the button
 * @constructor
 */
export const SubmitButton = forwardRef<HTMLButtonElement, ActionButtonType>(
    function (props, ref) {

        return (
            <ActionButton ref={ref} {...{type: "submit", ...props}}>
                {props.children}
            </ActionButton>
        )

    });
