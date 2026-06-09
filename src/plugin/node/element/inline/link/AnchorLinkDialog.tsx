
import React from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {AnchorLinkElement, AnchorLinkPlugin, AnchorLinkType} from "./AnchorLinkPlugin";
import {ReactEditor, useSlateStatic} from "slate-react";
import {useRichSlatePlugin} from "@/component/context/useRichSlatePlugin.ts";
import {Dialog, DialogBody, DialogFooter, DialogHeader, DialogOptions} from "@/component/ui/dialog/Dialog.tsx";
import {Label} from "@/component/ui/form/Label.tsx";
import {LabelToolTip} from "@/component/ui/form/LabelToolTip.tsx";
import InputText from "@/component/ui/form/InputText.tsx";
import {FormError} from "@/component/ui/form/FormError.tsx";
import {LayoutHorizontal} from "@/component/ui/LayoutHorizontal.tsx";
import {ButtonGroup} from "@/component/ui/button/ButtonGroup.tsx";
import {DialogClose} from "@/component/ui/dialog/DialogClose.tsx";
import {SubmitButton} from "@/component/ui/button/SubmitButton.tsx";
import {ActionButton} from "@/component/ui/button/ActionButton.tsx";

/**
 * A link dialog that can be open via button click or double click
 * @param setDialogOpen - the callback to set the open state
 * @param ref - the ref
 * @constructor
 */
export const AnchorLinkDialog = React.forwardRef<HTMLDivElement, DialogOptions>(
    function ({setDialogOpen}: DialogOptions, ref: React.ForwardedRef<HTMLDivElement>) {
        const {
            register,
            reset,
            handleSubmit,
            setError,
            formState: {errors: formStateErrors}
        } = useForm<AnchorLinkType>();

        const editor = useSlateStatic() as ReactEditor;
        const anchorPlugin = useRichSlatePlugin<AnchorLinkPlugin>(AnchorLinkPlugin.TAG);
        if (anchorPlugin === undefined) {
            return <p>The Anchor plugin is not enabled</p>
        }

        const highestNodeEntry = anchorPlugin.getHighestNodeEntry<AnchorLinkElement>(editor);
        const isLinkElementFound = highestNodeEntry !== undefined;


        React.useEffect(() => {
            if (highestNodeEntry !== undefined) {
                const element = highestNodeEntry[0];
                reset({
                        url: element.url,
                        title: element.title,
                    }, {
                        keepDirtyValues: true, // user-interacted input will be retained
                        keepErrors: true, // input errors will be retained with value update
                    }
                )
            }
        }, [highestNodeEntry, reset]);

        const onDelete = () => {
            /**
             * Delete
             */
            anchorPlugin.deleteLinksInSelection(editor);
            /**
             * Close the dialog
             */
            setDialogOpen(false);
        }


        const onSubmit: SubmitHandler<AnchorLinkType> = async (data) => {
            let url;
            try {
                url = new URL(data.url);
            } catch (e) {
                setError('url', {
                    type: 'badData',
                    message: `The URL is not valid (${data.url})`
                });
                return;
            }

            if (!isLinkElementFound) {
                anchorPlugin.createLink(editor, {url, title: data.title});
            } else {
                anchorPlugin.updateLink(editor, {url, title: data.title});
            }

            /**
             * Close the dialog
             */
            setDialogOpen(false);
        }
        return (
            <Dialog ref={ref} setDialogOpen={setDialogOpen}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        {isLinkElementFound ? "Link Edit" : "Link Creation"}
                    </DialogHeader>
                    <DialogBody>
                        <div>
                            <Label>URL{' '}
                                <LabelToolTip>
                                    <p>The target URL address of your link</p>
                                    <p>Your user will navigate to this address by clicking on the
                                        link</p>
                                </LabelToolTip>
                            </Label>
                            <InputText
                                {...register('url', {required: true})}
                                placeholder={'https://example.com'}
                                isValid={formStateErrors.url == undefined}
                                autoFocus={true}
                            />
                            {formStateErrors.url?.type === "required" && (
                                <FormError>A URL is required</FormError>
                            )}
                            {formStateErrors.url?.type !== "required" && (
                                <FormError>{formStateErrors.url?.message}</FormError>
                            )}
                        </div>
                        <div>
                            <Label>Title{' '}
                                <LabelToolTip>
                                    <p>An optional title</p>
                                    <p>This title is:
                                        <ul>
                                            <li>shown when hovering above the link</li>
                                            <li>used by search engine (SE0) and email client to categorize your links
                                            </li>
                                        </ul>
                                    </p>
                                </LabelToolTip>
                            </Label>
                            <InputText
                                {...register('title')}
                                placeholder={'Title'}
                            />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <LayoutHorizontal distribution={isLinkElementFound ? 'between' : 'center'}>
                            <div/>
                            <ButtonGroup>
                                <DialogClose>Cancel</DialogClose>
                                <SubmitButton skin={"primary"}>
                                    {isLinkElementFound ? 'Update' : 'Create'}
                                </SubmitButton>
                            </ButtonGroup>
                            {isLinkElementFound && <ActionButton skin={'danger'}
                                                                 onClick={onDelete}>Delete</ActionButton>}
                        </LayoutHorizontal>
                    </DialogFooter>
                </form>
            </Dialog>
        )
    }
)
