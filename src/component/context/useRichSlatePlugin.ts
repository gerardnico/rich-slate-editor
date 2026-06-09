import {useRichSlate} from "./useRichSlate";
import {RichSlatePlugin} from "../../plugin/RichSlatePlugin.tsx";

/**
 * Return a plugin to be used in a component
 * @param name - the name of the plugin
 */
export function useRichSlatePlugin<T extends RichSlatePlugin>(name: string) {

    const richSlate = useRichSlate();
    const plugin = richSlate.getPlugin(name) as T;
    if (plugin === undefined) {
        throw new Error(`The plugin ${name} is not enabled`)
    }
    return plugin;

}
