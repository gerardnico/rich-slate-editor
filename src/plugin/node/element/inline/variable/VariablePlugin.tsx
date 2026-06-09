import {useFocused, useSelected} from "slate-react";
import {InlineElementPlugin} from "../../../../InlineElementPlugin";
import {RenderElementProps} from "slate-react/dist/components/editable";
import React from "react";
import {ElementDefBuilder} from "../../../../ElementDefBuilder.ts";
import {RichSlate} from "../../../../../RichSlate.tsx";
import {TagElement} from "../../../../IElementDef.ts";
import {BaseEditor, Editor, NodeEntry, Range, Transforms} from "slate";
import {VariableAutoComplete} from "./VariableAutoComplete.tsx";
import {VariableEnterAndDoubleClick} from "./VariableEnterAndDoubleClick.tsx";
import {VariableButton} from "./VariableButton.tsx";


export type VariableElementProps = {
    variableId: number
}

type VariableTagType = 'variable';
export type VariableElement = TagElement & VariableElementProps & {
    tag: VariableTagType
}

export type VariableType = {
    id: number;
    name: string;
    description: string;
}
export type VariablesObject = {
    [key: number]: VariableType
};

export class VariablePlugin extends InlineElementPlugin {

    static NAME: VariableTagType = 'variable';

    variablePattern;
    private readonly variables: VariablesObject;

    constructor(name: string, richSlate: RichSlate, variables: VariablesObject) {
        super(name, richSlate, () => {
            return [new ElementDefBuilder(VariablePlugin.NAME)
                .setIsInline(true)
                .setIsVoid(true)
                .setIsMarkableVoid(true)
            ]
        });
        this.variables = variables;

        /**
         * Add portal component
         */
        richSlate.addPortalComponents(this, [VariableAutoComplete, VariableEnterAndDoubleClick]);

        /**
         * Add button
         */
        richSlate.addToolbarButtons(this, [VariableButton])

        /**
         * Pattern and prefix
         */
        const variablePrefix = '$'
        /**
         * If the word is the variable prefix or a variable pattern, match
         * Double \ to escape and preserve the \ character
         */
        const pattern = '^\\' + variablePrefix + '(\\w*)$';
        this.variablePattern = new RegExp(pattern, "i");

    }


    render({attributes, children, element}: RenderElementProps & { element: VariableElement }) {
        const selected = useSelected()
        const focused = useFocused()
        const style: React.CSSProperties = {
            padding: '3px 3px 2px',
            margin: '0 1px',
            verticalAlign: 'baseline',
            display: 'inline-block',
            borderRadius: '4px',
            backgroundColor: '#eee',
            fontSize: '0.9em',
            boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
        }
        // See if our empty text child has any styling marks applied and apply those
        if ('bold' in element.children[0]) {
            style.fontWeight = 'bold'
        }
        if ('italic' in element.children[0]) {
            style.fontStyle = 'italic'
        }
        const variable = this.variables[element.variableId];
        return (
            <span
                {...attributes}
                contentEditable={false}
                data-cy={`variable-${variable.name.replace(' ', '-')}`}
                style={style}
                title={`Variable ${variable.name}: ${variable.description}`}
            >
                ${variable.name}
                {children}
            </span>
        )
    }


    insertVariable(editor: BaseEditor, id: number) {
        const variable: VariableElement = {
            tag: VariablePlugin.NAME,
            variableId: id,
            children: [{text: ''}],
        }
        Transforms.insertNodes(editor, variable)
        Transforms.move(editor)
    }

    /**
     * Return the detected match and its range
     * with the current editor selection
     * @param editor
     */
    detectVariableAtCurrentSelection(editor: Editor): { range?: Range, match?: string } {
        const {selection} = editor
        if (!(selection && Range.isCollapsed(selection))) {
            return {};
        }

        const [selectionStartPoint] = Range.edges(selection)
        const wordBeforePoint = Editor.before(editor, selectionStartPoint, {unit: 'word'})
        if (!wordBeforePoint) {
            return {};
        }
        const wordRange = Editor.range(editor, wordBeforePoint, selectionStartPoint)
        const word = Editor.string(editor, wordRange)
        const match = word && this.variablePattern.exec(word)
        if (!(match)) {
            return {};
        }
        return {
            range: wordRange,
            match: match[1]
        }
    }

    getVariables() {
        return this.variables;
    }

    delete(editor: BaseEditor, variableElement?: NodeEntry<VariableElement>) {
        if (variableElement === undefined) {
            variableElement = this.getHighestNodeEntry(editor);
            if (variableElement === undefined) {
                console.error("No variable element could be found");
                return;
            }
        }
        Transforms.removeNodes(editor, {
            at: variableElement[1]
        })
    }

    updateVariable(editor: BaseEditor, nodeEntry: NodeEntry<VariableElement>, newProperties: Partial<VariableElementProps>) {

        if (nodeEntry === undefined) {
            const nodeEntry = this.getHighestNodeEntry(editor);
            if (nodeEntry === null) {
                return;
            }
        }

        /**
         * Set new properties on Element at location
         */
        Transforms.setNodes<VariableElement>(
            editor,
            newProperties,
            {
                at: nodeEntry[1]
            }
        );
    }
}
