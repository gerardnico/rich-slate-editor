import React, {useMemo} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {ReactEditor, useSlateStatic} from "slate-react";
import {useRichSlatePlugin} from "@/component/context/useRichSlatePlugin.ts";
import {VariableElement, VariableElementProps, VariablePlugin} from "./VariablePlugin.tsx";
import {ActionButton} from "@/component/ui/button/ActionButton.tsx";
import {Dialog, DialogBody, DialogFooter, DialogHeader, DialogOptions} from "@/component/ui/dialog/Dialog.tsx";
import {ButtonGroup} from "@/component/ui/button/ButtonGroup.tsx";
import {DialogClose} from "@/component/ui/dialog/DialogClose.tsx";
import {Label} from "@/component/ui/form/Label.tsx";
import {LabelToolTip} from "@/component/ui/form/LabelToolTip.tsx";
import {TooltipHeading} from "@/component/ui/tooltip/TooltipHeading.tsx";
import {TextField} from "@/component/ui/form/TextField.tsx";
import {SelectField} from "../../../../../component/ui/select/SelectField.tsx";
import {LayoutHorizontal} from "@/component/ui/LayoutHorizontal.tsx";
import {SubmitButton} from "@/component/ui/button/SubmitButton.tsx";

/**
 * A Dialog that can be open via button click or double click
 * @param setDialogOpen - the callback to set the open state
 * @param ref - the ref
 * @constructor
 */
export const VariableDialog = React.forwardRef<HTMLDivElement, DialogOptions>(
    function ({setDialogOpen}: DialogOptions, ref: React.ForwardedRef<HTMLDivElement>) {


        const variablePlugin = useRichSlatePlugin<VariablePlugin>(VariablePlugin.NAME);
        if (variablePlugin === undefined) {
            let message = "The variable plugin is not enabled";
            console.error(message)
            return <p>{message}</p>
        }

        const editor = useSlateStatic() as ReactEditor;

        const highestNodeEntry = variablePlugin.getHighestNodeEntry<VariableElement>(editor);
        const isVariableElementFound = highestNodeEntry !== undefined;

        let defaultId = Number(Object.keys(variablePlugin.getVariables())[0]);

        const {
            register,
            handleSubmit
        } = useForm<VariableElementProps>({
            defaultValues: {
                variableId: highestNodeEntry !== undefined ? highestNodeEntry[0].variableId : defaultId
            }
        });

        const onDelete = () => {
            /**
             * Delete
             */
            variablePlugin.delete(editor, highestNodeEntry);
            /**
             * Close the dialog
             */
            setDialogOpen(false);
        }


        const onSubmit: SubmitHandler<VariableElementProps> = async (data) => {


            if (!highestNodeEntry) {
                variablePlugin.insertVariable(editor, data.variableId);
            } else {
                variablePlugin.updateVariable(editor, highestNodeEntry, {variableId: data.variableId});
            }

            /**
             * Close the dialog
             */
            setDialogOpen(false);
        }

        const sortedVariables = useMemo(() => {
            return Object.values(variablePlugin.getVariables())
                .sort((variable1, variable2) => variable1.name.localeCompare(variable2.name));
        }, [variablePlugin]);

        return (
            <Dialog ref={ref} setDialogOpen={setDialogOpen}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        {isVariableElementFound ? "Variable Edit" : "Variable Creation"}
                    </DialogHeader>
                    <DialogBody>
                        <div>
                            <p>A variable is an element where the value is replaced at runtime.</p>
                            <Label>Variable name{' '}
                                <LabelToolTip maxWidth={"360px"}>
                                    <TooltipHeading>The variable name</TooltipHeading>
                                    <p>Tip: You can also use the <TextField bold={true}>$</TextField> character to get
                                        an autocompletion list
                                        while writing.
                                    </p>
                                    <p><TextField bold={true}>Variables Descriptions:</TextField></p>
                                    <ul>
                                        {sortedVariables.map((variable, index) => {
                                            return <li key={index}><TextField
                                                bold={true}>{variable.name}</TextField>: {variable.description}</li>
                                        })}
                                    </ul>
                                </LabelToolTip>
                            </Label>
                            <SelectField {...register('variableId', {required: true})}
                                         autoFocus={true}>
                                {sortedVariables.map((variable, index) => {
                                    return (<option key={index} value={variable.id}>{variable.name}</option>)
                                })}
                            </SelectField>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <LayoutHorizontal distribution={isVariableElementFound ? 'between' : 'center'}>
                            <div/>
                            <ButtonGroup>
                                <DialogClose>Cancel</DialogClose>
                                <SubmitButton skin={"primary"}>
                                    {isVariableElementFound ? 'Update' : 'Create'}
                                </SubmitButton>
                            </ButtonGroup>
                            {isVariableElementFound && <ActionButton skin={'danger'}
                                                                     onClick={onDelete}>Delete</ActionButton>}
                        </LayoutHorizontal>
                    </DialogFooter>
                </form>
            </Dialog>
        )
    }
)
