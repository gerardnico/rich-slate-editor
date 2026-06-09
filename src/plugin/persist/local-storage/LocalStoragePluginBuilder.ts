import {ISlatePluginBuilder} from "../../ISlatePluginBuilder.ts";
import {RichSlate} from "../../../RichSlate.tsx";
import {RichSlatePlugin} from "../../RichSlatePlugin.tsx";
import {LocalStoragePlugin} from "./LocalStoragePlugin.ts";

export class LocalStoragePluginBuilder implements ISlatePluginBuilder {

    getName() {
        return LocalStoragePlugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new LocalStoragePlugin(LocalStoragePlugin.NAME, richSlateEditor);
    }

}
