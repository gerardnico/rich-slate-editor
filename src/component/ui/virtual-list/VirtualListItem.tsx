import {ButtonHTMLAttributes, forwardRef} from "react";
import {cn} from "@/lib/utils.ts";


export const VirtualListItem = forwardRef<
    HTMLButtonElement,
    ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }
>(({active, ...props}, ref) => {
    return (
        <li>
            <button
                {...props}
                ref={ref}
                type="button"
                role="listitem"
                tabIndex={-1}
                className={cn("dropdown-item", "focus-ring-light", active ? "active" : undefined)}
            />
        </li>
    );
});
