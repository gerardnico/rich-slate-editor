import {ISlatePluginBuilder} from "../../ISlatePluginBuilder";
import {RichSlate} from "../../../RichSlate";
import {RichSlatePlugin} from "../../RichSlatePlugin.tsx";
import {UnderlineMarkPlugin} from "./UnderlineMarkPlugin.tsx";


// noinspection JSUnusedGlobalSymbols
export class UnderlineMarkPluginBuilder implements ISlatePluginBuilder {

    getName() {
        return UnderlineMarkPlugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new UnderlineMarkPlugin(UnderlineMarkPlugin.NAME, richSlateEditor);
    }

}
