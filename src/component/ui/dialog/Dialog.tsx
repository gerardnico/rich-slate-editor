/**
 * Implementation of:
 * * a dialog in Floating UI (https://floating-ui.com/docs/dialog)
 * * a dialog in https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog
 * * a Modal in Bootstrap (https://getbootstrap.com/docs/5.2/components/modal/)
 */
import * as React from "react";
import {useMemo, useState} from "react";
import {
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    useClick,
    useDismiss,
    useFloating,
    useId,
    useInteractions,
    useMergeRefs,
    useRole
} from "@floating-ui/react";
import {DialogContext, useDialogContext} from "./useDialogContext.ts";
import styles from './dialog.module.css'
import {DialogClose} from "./DialogClose.tsx";

/**
 * A hook that
 * returns the combined Floating ui hooks
 */
function useDialog({setDialogOpen: setOpen}: DialogOptions) {

    const [labelId, setLabelId] = useState<string | undefined>();
    const [descriptionId, setDescriptionId] = useState<string | undefined>();

    const data = useFloating({
        open: true, // by default, the dialog does not open, we open it when the dialog is rendered
        onOpenChange: setOpen
    });

    const context = data.context;

    const click = useClick(context);
    const dismiss = useDismiss(context, {outsidePressEvent: "mousedown"});
    const role = useRole(context);

    const interactions = useInteractions([click, dismiss, role]);

    return useMemo(
        () => ({
            setOpen,
            ...interactions,
            ...data,
            labelId,
            descriptionId,
            setLabelId,
            setDescriptionId
        }),
        [setOpen, interactions, data, labelId, descriptionId, setLabelId,
            setDescriptionId]
    );
}

export type UseDialogType = ReturnType<typeof useDialog>;


/**
 * The options that should use a component that uses a Dialog
 */
export type DialogOptions = {
    // the state function that controls the open state
    setDialogOpen: (open: boolean) => void;
}

type DialogElement = DialogOptions & React.HTMLProps<HTMLDivElement>;

/**
 * A Dialog that should be added conditionally
 * via a boolean state and the callback setter should be given as props.
 *
 * A dialog component close on `mouseDown` by default.
 * You should open it with a `onClick`.
 * If you open it with an `mouseDown`, the dialog will close immediately.
 *
 * This component is the top component.
 *
 * Ref is used to be able to track if the dialog is mounted or not
 * (In case of conditional double click for instance)
 */
export const Dialog = React.forwardRef<
    HTMLDivElement,
    DialogElement
>(function ({children, setDialogOpen, ...props}: DialogElement, propRef) {
        const dialog = useDialog({setDialogOpen});
        const ref = useMergeRefs([dialog.refs.setFloating, propRef]);
        if (!dialog.context.open) return null;
        return (
            <DialogContext.Provider value={dialog}>
                <FloatingPortal>
                    <FloatingOverlay className={styles.DialogBackdrop + ' modal fade show d-block'} lockScroll>
                        <FloatingFocusManager context={dialog.context}>
                            <div
                                ref={ref}
                                aria-labelledby={dialog.labelId}
                                aria-describedby={dialog.descriptionId}
                                className={'modal-dialog modal-dialog-centered'}
                                {...dialog.getFloatingProps(props)}
                            >
                                <div className="modal-content">
                                    {children}
                                </div>
                            </div>
                        </FloatingFocusManager>
                    </FloatingOverlay>
                </FloatingPortal>
            </DialogContext.Provider>
        );
    }
)


export const DialogHeader = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLProps<HTMLHeadingElement>
>(function DialogHeading({children, ...props}, ref) {
    const {setLabelId} = useDialogContext();
    const id = useId();

    // Only sets `aria-labelledby` on the Dialog root element
    // if this component is mounted inside it.
    React.useLayoutEffect(() => {
        setLabelId(id);
        return () => setLabelId(undefined);
    }, [id, setLabelId]);

    return (
        <div className='modal-header'>
            <h5 className="modal-title" {...props} ref={ref} id={id}>
                {children}
            </h5>
            <DialogClose mode='cross'/>
        </div>
    );
});

export const DialogFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLProps<HTMLDivElement>
>(function ({children, ...props}, ref) {

    return (
        <div className='modal-footer d-block' ref={ref} {...props}>
            {children}
        </div>
    );
});

export const DialogBody = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLProps<HTMLParagraphElement>
>(function DialogDescription({children, ...props}, ref) {
    const {setDescriptionId} = useDialogContext();
    const id = useId();

    // Only sets `aria-describedby` on the Dialog root element
    // if this component is mounted inside it.
    React.useLayoutEffect(() => {
        setDescriptionId(id);
        return () => setDescriptionId(undefined);
    }, [id, setDescriptionId]);

    return (
        <div className='modal-body' {...props} ref={ref} id={id}>
            {children}
        </div>
    );
});
