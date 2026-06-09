import {Tooltip} from "../tooltip/Tooltip.tsx";
import {BsQuestionCircle} from "react-icons/bs";
import React from "react";
import {TooltipContent, ToolTipContentType} from "../tooltip/TooltipContent.tsx";
import {TooltipTrigger} from "../tooltip/TooltipTrigger.tsx";

type LabelToolTipPropsType = ToolTipContentType & { trigger?: React.ReactNode };

export function LabelToolTip({
                                 trigger = <BsQuestionCircle/>, ...props
                             }: LabelToolTipPropsType) {
    return (
        <Tooltip>
            <TooltipTrigger>{trigger}</TooltipTrigger>
            <TooltipContent {...props}/>
        </Tooltip>
    )
}
