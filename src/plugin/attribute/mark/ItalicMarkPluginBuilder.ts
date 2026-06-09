import {ISlatePluginBuilder} from "../../ISlatePluginBuilder";
import {RichSlate} from "../../../RichSlate";
import {RichSlatePlugin} from "../../RichSlatePlugin.tsx";
import {ItalicMarkPlugin} from "./ItalicMarkPlugin.tsx";


// noinspection JSUnusedGlobalSymbols
export class ItalicMarkPluginBuilder implements ISlatePluginBuilder {

    getName() {
        return ItalicMarkPlugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new ItalicMarkPlugin(ItalicMarkPlugin.NAME, richSlateEditor);
    }

}
