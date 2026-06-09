import {RichSlatePluginI} from "./RichSlatePluginI.ts";
import {ReactEditor} from "slate-react";
import {RichSlate} from "../RichSlate";
import {HistoryEditor} from "slate-history";


/**
 * A rich slate plugin
 * May be an event handlers, an element or a text mark
 */
export abstract class RichSlatePlugin implements RichSlatePluginI {

    private readonly richSlate: RichSlate;
    private readonly name: string;

    constructor(name: string, richSlate: RichSlate) {
        this.name = name;
        this.richSlate = richSlate;
    }

    getName(): string {
        return this.name;
    }


    getSlateEditor(): ReactEditor & HistoryEditor {
        return this.richSlate.getSlateEditor();
    }

    getRichSlate() {
        return this.richSlate;
    }



}
