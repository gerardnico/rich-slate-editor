import {createHyperscript, createText} from 'slate-hyperscript'
import {PElementPlugin} from "../src/plugin/node/element/block/paragraph/PElementPlugin";

/**
 * This is the mapping for the JSX that creates editor state.
 *
 * The h is normally the hyperscript prefix
 *
 * Based on:
 * https://github.com/ianstormtaylor/slate/blob/main/packages/slate/test/index.js#L65
 *
 * Explained here: [slate-hyperscript](../doc/slate-hyperscript.md)
 */

export const jsx = createHyperscript({
    elements: {
        // paragraph and not p to no conflict with html
        paragraph: {tag: PElementPlugin.PARAGRAPH_TAG},
        code: { tag: 'code-block' },
        element: {},
        wrapper: {},
        inline: { inline: true },
    },
    creators: {
        htext: createText,
    },
})
