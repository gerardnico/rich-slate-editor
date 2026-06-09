import React, {ButtonHTMLAttributes} from "react";
import {RichSlateToolbarIcon} from "./RichSlateToolbarIcon";

import styles from './toolbar.module.css';
import {TransparentButton} from "@/component/ui/button/TransparentButton.tsx";

/**
 * We use an object so that we can
 * use a AND in typescript
 * to compose object
 */
export type SelectedState = {
    selected: boolean
}

export type RichSlateToolbarButtonAttributes = ButtonHTMLAttributes<HTMLButtonElement> & SelectedState &
    {
        iconName: string
    };

/**
 * A function that returns dynamic css based on
 * selected attribute
 * * selected: when the label was selected
 */
export function dynamicButtonStyle(props: SelectedState): React.CSSProperties {
    return {
        backgroundColor: props.selected ? '#D3E3FD' : 'inherit'
    }
}


export const RichSlateToolbarIconButton = React.forwardRef<HTMLButtonElement, RichSlateToolbarButtonAttributes>(
    function ({
                  selected,
                  iconName,
                  ...props
              }: RichSlateToolbarButtonAttributes
        , forwardedRef) {

        return <TransparentButton
            style={
                {
                    ...props.style,
                    ...dynamicButtonStyle({selected})
                }}
            className={styles.toolbarButton}
            {...props}
            ref={forwardedRef}
        >
            <RichSlateToolbarIcon iconName={iconName}/>
        </TransparentButton>
    })
