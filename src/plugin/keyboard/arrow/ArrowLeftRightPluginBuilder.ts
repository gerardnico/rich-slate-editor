import {ISlatePluginBuilder} from "../../ISlatePluginBuilder";
import {RichSlate} from "../../../RichSlate";
import {RichSlatePlugin} from "../../RichSlatePlugin.tsx";
import {ArrowLeftRightPlugin} from "./ArrowLeftRightPlugin.ts";


export class ArrowLeftRightPluginBuilder implements ISlatePluginBuilder {

    getName() {
        return ArrowLeftRightPlugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new ArrowLeftRightPlugin(ArrowLeftRightPlugin.NAME, richSlateEditor);
    }

}
