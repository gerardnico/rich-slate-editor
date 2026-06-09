import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";
import {RichSlate} from "../../../../../RichSlate";
import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";
import {H6Plugin} from "./H6Plugin";


// noinspection JSUnusedGlobalSymbols
export class H6PluginBuilder implements ISlatePluginBuilder {


    getName() {
        return H6Plugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new H6Plugin(H6Plugin.NAME, richSlateEditor);
    }

}
