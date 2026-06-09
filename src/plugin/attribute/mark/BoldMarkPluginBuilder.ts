import {ISlatePluginBuilder} from "../../ISlatePluginBuilder";
import {RichSlate} from "../../../RichSlate";
import {BoldMarkPlugin} from "./BoldMarkPlugin.tsx";
import {RichSlatePlugin} from "../../RichSlatePlugin.tsx";


// noinspection JSUnusedGlobalSymbols
export class BoldMarkPluginBuilder implements ISlatePluginBuilder {

    getName() {
        return BoldMarkPlugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new BoldMarkPlugin(BoldMarkPlugin.NAME, richSlateEditor);
    }

}
