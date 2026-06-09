import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";
import {RichSlate} from "../../../../../RichSlate";
import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";
import {H3Plugin} from "./H3Plugin";


// noinspection JSUnusedGlobalSymbols


export class H3PluginBuilder implements ISlatePluginBuilder {


    getName() {
        return H3Plugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new H3Plugin(H3Plugin.NAME, richSlateEditor);
    }

}
