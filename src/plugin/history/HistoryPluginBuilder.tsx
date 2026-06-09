import {RichSlatePlugin} from "../RichSlatePlugin.tsx";
import {ISlatePluginBuilder} from "../ISlatePluginBuilder";
import {RichSlate} from "../../RichSlate";
import {HistoryPlugin} from "./HistoryPlugin";

/**
 * The history plugin is automatically built-in added
 */
export class HistoryPluginBuilder implements ISlatePluginBuilder {
    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new HistoryPlugin(this.getName(), richSlateEditor);
    }

    getName(): string {
        return HistoryPlugin.NAME;
    }


}
