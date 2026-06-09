import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";
import {RichSlate} from "../../../../../RichSlate";
import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";
import {H5Plugin} from "./H5Plugin";


// noinspection JSUnusedGlobalSymbols


export class H5PluginBuilder implements ISlatePluginBuilder {


    getName() {
        return H5Plugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new H5Plugin(H5Plugin.NAME, richSlateEditor);
    }

}
