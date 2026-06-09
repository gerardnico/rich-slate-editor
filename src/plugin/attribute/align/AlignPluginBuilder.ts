import {ISlatePluginBuilder} from "../../ISlatePluginBuilder";
import {RichSlate} from "../../../RichSlate";
import {RichSlatePlugin} from "../../RichSlatePlugin.tsx";
import {AlignPlugin} from "./AlignPlugin";


export class AlignPluginBuilder implements ISlatePluginBuilder {

    getName() {
        return AlignPlugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new AlignPlugin(AlignPlugin.NAME, richSlateEditor);
    }

}
