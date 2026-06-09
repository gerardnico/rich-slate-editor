import {HTMLAttributes} from "react";
import {cn} from "@/lib/utils.ts";



export function TooltipHeading({headingStyle = 'h5', ...props}: HTMLAttributes<HTMLElement> & {
    headingStyle?: 'h5' | 'h6'
}) {
    return <p {...props} className={cn(props.className, headingStyle)}/>
}
