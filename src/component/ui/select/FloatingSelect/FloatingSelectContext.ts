import {useInteractions} from "@floating-ui/react";
import {createContext} from "react";

export interface FloatingSelectContextValue {
    activeIndex: number | null;
    selectedIndex: number | null;
    getItemProps: ReturnType<typeof useInteractions>["getItemProps"];
    handleSelect: (index: number | null) => void;
}

export const FloatingSelectContext = createContext<FloatingSelectContextValue>(
    {} as FloatingSelectContextValue
);
