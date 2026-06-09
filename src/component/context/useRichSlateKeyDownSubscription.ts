import * as React from "react";
import {RichSlatePlugin} from "../../plugin/RichSlatePlugin.tsx";
import {useRichSlate} from "./useRichSlate.ts";

/**
 * Subscribe to key-down event
 * @param plugin - plugin
 * @param name - component name
 * @param handler - handler
 */
export const useRichSlateKeyDownSubscription = (plugin: RichSlatePlugin, name: string, handler: (event: React.KeyboardEvent) => void) => {

    const richSlate = useRichSlate();
    const richSlateHandler = {plugin, name, handler}
    // Subscribe to key down
    React.useEffect(() => {
        richSlate.addOnKeyDownHandler(richSlateHandler)
        return () => {
            richSlate.deleteOnKeyDownHandler(richSlateHandler);
        };
    }, []);
};
