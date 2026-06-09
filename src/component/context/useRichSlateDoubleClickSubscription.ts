import * as React from "react";
import {RichSlatePlugin} from "../../plugin/RichSlatePlugin.tsx";
import {useRichSlate} from "./useRichSlate.ts";

/**
 * Subscribe to double-click event
 * @param plugin
 * @param handler
 */
export const useRichSlateDoubleClickSubscription = (plugin: RichSlatePlugin, handler: (event: React.MouseEvent) => void) => {

    const richSlate = useRichSlate();
    // Subscribe to double-click
    React.useEffect(() => {

        richSlate.addDoubleClickHandler(plugin, handler)

        return () => {
            richSlate.deleteDoubleClickHandler(plugin);
        };
    }, []);
};
