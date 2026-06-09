import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";
import {RichSlate} from "../../../../../RichSlate";
import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";
import {ImagePlugin} from "./ImagePlugin.tsx";

export class ImagePluginBuilder implements ISlatePluginBuilder {

    getName() {
        return ImagePlugin.NAME;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        return new ImagePlugin(ImagePlugin.NAME, richSlateEditor);
    }

}
