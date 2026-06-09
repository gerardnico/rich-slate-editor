import * as React from "react";
import {RichSlate} from "../../RichSlate";

export const RichSlateContext = React.createContext<RichSlate | null>(null);

export const useRichSlate = () => {
    const richSlate = React.useContext(RichSlateContext);
    if (richSlate == null) {
        throw new Error("Rich Slate components must be wrapped in a <RichSlateEditor />");
    }
    return richSlate;
};
