import * as React from "react";
import {forwardRef} from "react";
import {ActionButton, ActionButtonType} from "../button/ActionButton.tsx";
import {useDialogContext} from "./useDialogContext.ts";

export const DialogClose = forwardRef<
    HTMLButtonElement,
    ActionButtonType
>(function (props, ref) {
    const {setOpen} = useDialogContext();
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (props.onClick !== undefined) {
            props.onClick(event);
        }
        setOpen(false)
    };
    const label = "Close"
    return (
        <ActionButton {...props}
                      ref={ref}
                      skin={"secondary"}
                      onClick={onClick}
                      aria-label={label}
        />
    );
});
