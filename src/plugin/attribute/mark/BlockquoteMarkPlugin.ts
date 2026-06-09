import React from "react";
import {BooleanTextMarkPlugin} from "../../BooleanTextMarkPlugin";


export interface BlockquoteAttribute {
    blockquote?: boolean,
}

// noinspection JSUnusedGlobalSymbols
export class BlockquoteMarkPlugin extends BooleanTextMarkPlugin {

    getHotKey(): string {
        throw new Error("Method not implemented.");
    }


    readonly NAME = 'blockquote';


    getBooleanStylingProps(): React.HTMLAttributes<HTMLSpanElement> {
        return {
            style: {
                display: 'inline-block',
                borderLeft: '2px solid #ddd',
                paddingLeft: '10px',
                color: '#aaa',
                fontStyle: 'italic'
            }
        };
    }


    getCommandIconName(): string {
        return "format_bold";
    }

}
