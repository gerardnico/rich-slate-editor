import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";
import {RichSlate} from "../../../../../RichSlate";
import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";
import {H1Plugin} from "./H1Plugin";


// noinspection JSUnusedGlobalSymbols
export class H1PluginBuilder implements ISlatePluginBuilder {

    getName() {
        return H1Plugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new H1Plugin(H1Plugin.NAME, richSlateEditor);
    }

}
