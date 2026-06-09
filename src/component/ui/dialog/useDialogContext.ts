import * as React from "react";
import {UseDialogType} from "./Dialog.tsx";


type ContextType = (
    UseDialogType
    & {
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
    setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>;
}
    ) | null;

export const DialogContext = React.createContext<ContextType>(null);

/**
 * A context that can be used to
 * control the dialog.
 * ie to close the dialog (see {@link DialogClose}
 */
export const useDialogContext = () => {
    const context = React.useContext(DialogContext);

    if (context == null) {
        throw new Error("Dialog components must be wrapped in <Dialog />");
    }
    return context;
};
