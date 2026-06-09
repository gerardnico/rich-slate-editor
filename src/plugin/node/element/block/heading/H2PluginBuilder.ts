import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";
import {RichSlate} from "../../../../../RichSlate";
import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";
import {H2Plugin} from "./H2Plugin";


// noinspection JSUnusedGlobalSymbols
export class H2PluginBuilder implements ISlatePluginBuilder {

    getName() {
        return H2Plugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new H2Plugin(H2Plugin.NAME, richSlateEditor);
    }

}
