import {ListPlugin} from "./ListPlugin";
import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";
import {RichSlate} from "../../../../../RichSlate";
import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";

export class ListPluginBuilder implements ISlatePluginBuilder {

    getName() {
        return ListPlugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new ListPlugin(ListPlugin.NAME, richSlateEditor);
    }

}
