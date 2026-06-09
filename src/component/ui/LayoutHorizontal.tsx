import React from "react";
import {cn} from "@/lib/utils.ts";

/**
 * The value are:
 * * `between` layout the extremes on each edge and distribute the resting space
 * * `evenly` pushes the elements towards the center without touching the edges
 * * `around` pushes the elements towards the edges without touching them
 * * `center` layout all elements touching each other in the center
 * * `start` layout all elements touching each other in the start
 * * `end` layout all elements touching each other in the end
 */
export type HorizontalDistribution = 'center' | 'start' | 'end' |
    'between' |
    'evenly' |
    'around';

type LayoutHorizontalType = React.HTMLAttributes<HTMLDivElement> & {
    distribution: HorizontalDistribution
};
/**
 * An element that layouts by distributing elements on the X axis.
 * It uses flex and justify-content
 * It passes a ref because it can be uses for a floating toolbar
 * @param distribution - the distribution type
 * @param props - div props - By default, it applies a margin-bottom of 3.
 * @constructor
 */
export const LayoutHorizontal = React.forwardRef<HTMLDivElement, LayoutHorizontalType>(function ({
                                                                                                     distribution,
                                                                                                     ...props
                                                                                                 }, ref) {
    return (
        <div {...props}
             ref={ref}
             className={cn('d-flex', `justify-content-${distribution}`, props.className ?? 'mb-3')}>
            {props.children}
        </div>
    )

})
