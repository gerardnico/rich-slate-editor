import {PElementPlugin} from "./PElementPlugin";
import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";
import {RichSlate} from "../../../../../RichSlate";
import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";


export class PElementPluginBuilder implements ISlatePluginBuilder {

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new PElementPlugin(this.getName(), richSlateEditor);
    }

    getName(): string {
        return PElementPlugin.PARAGRAPH_TAG;
    }


}
