import * as React from "react";
import {RichSlatePlugin} from "../../plugin/RichSlatePlugin.tsx";
import {useRichSlate} from "./useRichSlate.ts";

/**
 * Subscribe to tree change event
 * @param plugin
 * @param handler
 */
export const useRichSlateChangeSubscription = (plugin: RichSlatePlugin, handler: () => void) => {

    const richSlate = useRichSlate();
    React.useEffect(() => {
        richSlate.addOnChangeHandler(plugin, handler)
        return () => {
            richSlate.deleteOnChangeHandler(plugin);
        };
    }, []);
};
