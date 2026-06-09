import React from "react";
import {useRichSlate} from "../context/useRichSlate";
import {ButtonGroup} from "@/component/ui/button/ButtonGroup.tsx";

export const RichSlateToolbarActionButtons = ({className, ...props}: React.HTMLAttributes<HTMLDivElement>) => {

    const richSlate = useRichSlate();
    return (
        <ButtonGroup {...props}>
            {[...richSlate.getMenuToolbarButtons().entries()].map(([toolbarPlugin, buttons]) => {
                return buttons.map((ToolbarButton, index) => {
                    return <ToolbarButton key={`${toolbarPlugin.getName()}-${index}`}/>
                })
            })}
        </ButtonGroup>
    )
}
