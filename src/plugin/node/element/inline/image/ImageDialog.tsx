
import React from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {ReactEditor, useSlateStatic} from "slate-react";
import {useRichSlatePlugin} from "@/component/context/useRichSlatePlugin.ts";
import {ImageAttributes, ImageElement, ImagePlugin} from "./ImagePlugin.tsx";
import {Dialog, DialogBody, DialogFooter, DialogHeader, DialogOptions} from "@/component/ui/dialog/Dialog.tsx";
import {Imgy} from "@/lib/Imgy.ts";
import {Label} from "@/component/ui/form/Label.tsx";
import {LabelToolTip} from "@/component/ui/form/LabelToolTip.tsx";
import InputText from "@/component/ui/form/InputText.tsx";
import {LayoutHorizontal} from "@/component/ui/LayoutHorizontal.tsx";
import {ActionButton} from "@/component/ui/button/ActionButton.tsx";
import {FormError} from "@/component/ui/form/FormError.tsx";
import {ButtonGroup} from "@/component/ui/button/ButtonGroup.tsx";
import {DialogClose} from "@/component/ui/dialog/DialogClose.tsx";
import {SubmitButton} from "@/component/ui/button/SubmitButton.tsx";

/**
 * A image dialog that can be open via button click or double click
 * @param setDialogOpen - the callback to set the open state
 * @param ref - the ref
 * @constructor
 */
export const ImageDialog = React.forwardRef<HTMLDivElement, DialogOptions>(
    function ({setDialogOpen}: DialogOptions, ref: React.ForwardedRef<HTMLDivElement>) {
        const {
            register,
            reset,
            handleSubmit,
            setError,
            formState: {errors: formStateErrors}
        } = useForm<ImageAttributes>();

        const editor = useSlateStatic() as ReactEditor;
        const imagePlugin = useRichSlatePlugin<ImagePlugin>(ImagePlugin.NAME);
        if (imagePlugin === undefined) {
            return <p>The image plugin is not enabled</p>
        }

        const highestNodeEntry = imagePlugin.getHighestNodeEntry<ImageElement>(editor);
        const isImageElementFound = highestNodeEntry !== undefined;

        if (highestNodeEntry !== undefined) {
            const element = highestNodeEntry[0];
            reset({
                    url: element.url,
                alt: element.alt,
                }, {
                    keepDirtyValues: true, // user-interacted input will be retained
                    keepErrors: true, // input errors will be retained with value update
                }
            )
        }
        const onDelete = () => {
            /**
             * Delete
             */
            if (highestNodeEntry === undefined) {
                return;
            }
            const imagePath = highestNodeEntry[1];
            imagePlugin.deleteImageNode(editor, imagePath);
            /**
             * Close the dialog
             */
            setDialogOpen(false);
        }


        const onSubmit: SubmitHandler<ImageAttributes> = async (data) => {
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
            if (!Imgy.isImageUrl(url)) {
                setError('url', {
                    type: 'badData',
                    message: `This URL is not an image URL`
                });
                return
            }
            if (!isImageElementFound) {
                imagePlugin.insertImageNode(editor, {
                    url,
                    alt: data.alt
                });
            } else {
                const imagePath = highestNodeEntry[1];
                imagePlugin.updateImage(editor, {url, alt: data.alt}, imagePath);
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
                        {isImageElementFound ? "Image Edit" : "Image Creation"}
                    </DialogHeader>
                    <DialogBody>
                        <div>
                            <Label>URL{' '}
                                <LabelToolTip>
                                    <p>The URL address of your image</p>
                                </LabelToolTip>
                            </Label>
                            <InputText
                                {...register('url', {required: true})}
                                placeholder={'https://example.com/image.jpeg'}
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
                                </LabelToolTip>
                            </Label>
                            <InputText
                                {...register('alt')}
                                placeholder={'Title'}
                            />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <LayoutHorizontal distribution={isImageElementFound ? 'between' : 'center'}>
                            {isImageElementFound && <ActionButton skin={'danger'}
                                                                  onClick={onDelete}>Delete</ActionButton>}
                            <ButtonGroup>
                                <DialogClose>Cancel</DialogClose>
                                <SubmitButton skin={"primary"}>
                                    {isImageElementFound ? 'Update' : 'Create'}
                                </SubmitButton>
                            </ButtonGroup>
                        </LayoutHorizontal>
                    </DialogFooter>
                </form>
            </Dialog>
        )
    }
)
