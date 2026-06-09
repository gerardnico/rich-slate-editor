// noinspection JSUnusedGlobalSymbols
import {AnchorLinkPlugin} from "./AnchorLinkPlugin";
import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";
import {RichSlate} from "../../../../../RichSlate";
import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";

export class AnchorLinkPluginBuilder implements ISlatePluginBuilder {

    getName() {
        return AnchorLinkPlugin.TAG;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new AnchorLinkPlugin(AnchorLinkPlugin.TAG, richSlateEditor);
    }

}
