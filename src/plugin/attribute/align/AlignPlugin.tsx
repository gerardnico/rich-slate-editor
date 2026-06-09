import {ElementAttributePlugin} from "../../ElementAttributePlugin";
import {ElementPlugin} from "../../ElementPlugin";
import React from "react";
import {Editor} from "slate";
import {RenderElementProps} from "slate-react/dist/components/editable";
import {AlignButton} from "./AlignButton";
import {RichSlate} from "../../../RichSlate.tsx";


export type AlignValue = 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';

/**
 * Typescript
 */
export type AlignElement = ElementPlugin & {
    align: AlignValue
}

export class AlignPlugin extends ElementAttributePlugin<AlignElement> {


    static readonly NAME = 'align';


    constructor(name: string, richSlate: RichSlate) {
        super(name, richSlate);

        richSlate.addToolbarButtons(this, [AlignButton]);
    }

    getNewProperties(value: string): Partial<AlignElement> {
        let alignedValue: AlignValue;
        if (!this.isAlignTypeGuard(value)) {
            alignedValue = this.getDefaultValue();
        } else {
            alignedValue = value;
        }
        return {
            align: alignedValue
        }
    }


    isAttributeValueActive(editor: Editor, value: AlignValue) {
        return super.isAttributeValueActive(editor, value);
    }



    render(props: RenderElementProps): React.HTMLAttributes<HTMLElement> {
        return {
            style: {
                textAlign: (props.element as unknown as AlignElement).align
            }
        }
    }


    getValues(): AlignValue[] {
        return ['left', 'center', 'right', 'justify'];
    }

    getDefaultValue(): AlignValue {
        return 'left';
    }

    isAlignTypeGuard(value: string): value is AlignValue {
        return this.getValues().includes(value as AlignValue);
    }

}
