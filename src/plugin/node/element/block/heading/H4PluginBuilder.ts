import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";
import {RichSlate} from "../../../../../RichSlate";
import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";
import {H4Plugin} from "./H4Plugin";


// noinspection JSUnusedGlobalSymbols


export class H4PluginBuilder implements ISlatePluginBuilder {


    getName() {
        return H4Plugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new H4Plugin(H4Plugin.NAME, richSlateEditor);
    }

}
