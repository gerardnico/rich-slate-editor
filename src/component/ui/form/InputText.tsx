import {forwardRef, InputHTMLAttributes} from "react";
import LoadingSpan from "../loading/LoadingSpan.tsx";
import {cn} from "@/lib/utils.ts";

export type InputTextProps = InputHTMLAttributes<HTMLInputElement> &
    {
        loading?: boolean, // is the data loading (optional because we can use input text for validation. Example type delete to delete)
        isValid?: boolean // is the data valid
    };
/**
 * The base input element
 */
const InputText = forwardRef<
    HTMLInputElement,
    InputTextProps
>(function ({loading = false, isValid, ...props}, ref) {
    let className = cn('form-control', props.className);
    if (loading) {
        /**
         * Because this is an input element
         * It must be a span (inline), not a block
         * Otherwise, we may get a div inside a p and React is not happy
         */
        return <LoadingSpan {...props} >&nbsp;</LoadingSpan>
    }
    const newProps = {autoComplete: "off", ...props};

    if (isValid != undefined) {
        /**
         * We don't style if the value is valid
         * to not add any noise
         * Some field does not have any validation,
         * and we would add a green icon that has no indicator value at all
         * because the user does not need to do anything.
         */
        if (!isValid) {
            className = cn("is-invalid", className)
        }
        newProps["aria-invalid"] = isValid ? "true" : "false"
    }

    return (<input
        ref={ref}
        type="text" // before props because type can be overwritten
        {...newProps}
        className={className}
    />);

});

export default InputText