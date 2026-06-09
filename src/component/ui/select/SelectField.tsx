import {forwardRef, SelectHTMLAttributes} from "react";
import loadingStyles from '../loading/loading.module.css'

export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & { loading?: boolean };
/**
 * A select with a loading effect.
 * It will pulse if the children are undefined or the loading props is true
 */
export const SelectField = forwardRef<
    HTMLSelectElement,
    SelectFieldProps
>(function ({loading, children, ...rest}, ref) {
    if (loading == undefined) {
        loading = (children == undefined);
    }

    let className = 'form-select' + (rest.className !== undefined ? ' ' + rest.className : '');
    if (loading) {
        className += ' ' + loadingStyles.pulseGrayColor
    } else {
        // w-auto the select takes the width of the options element below
        className += ' w-auto';
    }
    return (
        <select ref={ref} {...rest} className={className}>
            {children}
        </select>
    )

});
