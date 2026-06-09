import React, {Ref} from "react";
import {Reacty} from "@/lib/Reacty.ts";
import {cn} from "@/lib/utils.ts";


export type FontName = 'material-icons' | 'bootstrap-icons';
export type FontIconType = React.HTMLAttributes<HTMLElement> & {
    iconName?: string,
    fontName?: FontName,
    size?: string
};
/**
 * An icon component using symbol fonts icon library.
 *
 * Name of icons should be interchangeable, you should not add the prefix in the name.
 * For instance: for Bootstrap icon, the alarm icon name should not be `bi-alarm` but `alarm`.
 *
 * Important: This component does not add the font.
 * You should add them in your HTML file
 * * Material: <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
 * * Bootstrap icon <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
 */
export const FontIcon = React.forwardRef(
    (
        {iconName, fontName = 'bootstrap-icons', ...props}: FontIconType,
        ref: Ref<HTMLElement>
    ) => {

        /**
         * The icon name can be given as children
         */
        if (iconName === undefined) {
            if (props.children === undefined) {
                iconName = "warning";
            } else {
                iconName = Reacty.extractText(props.children).toLowerCase();
            }
        }
        let iconClassName;
        let children: React.ReactNode = null;
        switch (fontName) {
            default:
            case 'bootstrap-icons':
                iconClassName = `bi-${iconName.toLowerCase()}`
                children = null;
                break;
        }

        return (
            <>
                <i
                    {...props}
                    ref={ref}
                    style={{fontSize: '1rem'}}
                    className={cn(iconClassName, props.className)}
                >{children}
                </i>
                <span className="visually-hidden">Icon {iconName}</span>
            </>
        )

    }
)
