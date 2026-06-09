import styles from "./loading.module.css"
import React from "react";
import {cn} from "@/lib/utils.ts";
import {Reacty} from "@/lib/Reacty.ts";


/**
 * A span that is pulsing to show that the text is loading
 * @param width - the width of the loading span used if the children does not have any text node
 * @param props - the props
 * @constructor
 */
export default function LoadingSpan({width = 150, ...props}: {
    width?: number | string
} & React.HTMLAttributes<HTMLSpanElement>) {

    /**
     * Make the span pulse
     *
     * Implements Boostrap placeholder ?
     * https://getbootstrap.com/docs/5.1/components/placeholders/
     */
    let className = cn(styles.pulseGrayColor, props.className);

    /**
     * Make the span height smaller than a line height
     * So that when the loading span are one on another on 2 lines,
     * they don't touch (the default line height is 24px)
     */
    let spanStyle = {};
    if (Object.keys(props).length === 0) {
        spanStyle = {
            height: '20px'
        };
    }


    /**
     * If there is children with text node,
     * shows them
     */
    if (props.children !== undefined) {
        const childrenText = Reacty.extractText(props.children);
        if (childrenText.length !== 0) {
            return (<span {...props} style={spanStyle}>{props.children}</span>)
        }
    }

    /**
     * The default span without any content
     */
    className = cn('d-inline-block', className);
    return (<span {...props} className={className} style={{width: width, ...spanStyle}}>&nbsp;</span>)

}
