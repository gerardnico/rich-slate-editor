import {ButtonHTMLAttributes, forwardRef} from "react";
import {cn} from "../../../lib/utils.ts";


export type ActionButtonType = ButtonHTMLAttributes<HTMLButtonElement>
    & {
    skin?: "primary" | "secondary" | "danger",
    fetching?: boolean, // does the action is actually fetching (pending)
    mode?: "button" | "cross" | 'link', // a button or a cross
    active?: boolean // does the action is the actual state
};
/**
 * Our base button where all other button are based on
 *
 * Note that a button role may be given to an anchor
 * <a href="#" role="button" aria-label="Delete item 1">Delete</a>
 * but as they don't have the same attributes (ie href, disabled),
 * we need for now to separate them as component. See LinkButton
 *
 * @param children - the label
 * @param skin - the name to style them
 * @param mode - the mode to style them as button, cross or link
 * @param fetching - the fetching state to show a spinner and disable the button
 * @constructor
 */
export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonType>(
    function ({
                  skin = "primary",
                  mode = "button",
                  fetching = false,
                  disabled = false,
                  active = false,
                  ...props
              }, ref) {


        let spinner = <></>;
        if (fetching !== undefined && fetching) {
            /**
             * https://getbootstrap.com/docs/5.2/components/spinners/#buttons
             */
            disabled = true;
            spinner = (
                <>
                    <span className="spinner-border spinner-border-sm pr-3" role="status" aria-hidden="true"></span>
                    {' '}
                </>
            )
        }
        let className;
        switch (mode) {
            default:
            case 'button': {
                className = `btn btn-${skin}`;
                break;
            }
            case 'cross': {
                // https://getbootstrap.com/docs/5.0/components/close-button/
                className = "btn-close";
                break;
            }
            case 'link': {
                className = 'btn btn-link d-inline m-0 p-0 lh-base align-baseline'
                break;
            }
        }
        if (active) {
            className = `${className} active`
        }

        return (
            <button
                // type="button" by default, to avoid the error: `Form submission canceled because the form is not connected`
                // when the button is in a form (ie for instance: to close a dialog)
                // the only prop that can be overridden
                type="button"
                {...props}
                // managed props
                ref={ref}
                className={cn(className, props.className)}
                disabled={disabled}
            >
                {spinner}
                {props.children}
            </button>
        )


    });
