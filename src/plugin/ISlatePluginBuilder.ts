import {RichSlate} from "../RichSlate";
import {RichSlatePlugin} from "./RichSlatePlugin.tsx";


export interface ISlatePluginBuilder {

    /**
     * The unique plugin name
     * (to be able to get the object with {@link RichSlate#getPlugin()}
     */
    getName(): string;

    /**
     * Build the plugin
     * The {@link RichSlate} constructor calls it to inject itself.
     * @param richSlateEditor
     */
    build(richSlateEditor: RichSlate): RichSlatePlugin;

}
