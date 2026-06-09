import {expect, test} from "vitest";
import {act, fireEvent, render, screen} from "@testing-library/react";
import {default as userEvent} from "@testing-library/user-event";
import {RichSlateMarkdownEditor} from "../pages/markdown/RichSlateMarkdownEditor";


/**
 * See
 * https://stackoverflow.com/questions/68988054/how-can-i-select-part-of-the-sentence-in-playwright
 *
 * See JSdom and contenteditable
 * https://github.com/jsdom/jsdom/issues/1670
 */

test('Markdown Test', async () => {


    render(<RichSlateMarkdownEditor name={'Markdown'}/>)

    let textBoxElement = screen.getByRole('textbox');
    /**
     * Manually add this because JSDom doesn't implement this and Slate checks for it
     * internally before doing stuff.
     */
    // @ts-ignore
    textBoxElement.isContentEditable = true

    /**
     * Emulates typing content into Slate.
     *
     * Slate React uses beforeinput events
     * Listen on the native `beforeinput` event to get real "Level 2" events.
     * https://github.com/ianstormtaylor/slate/blob/b5be790f3ebacd4480cc4505e8c32877bab84e29/packages/slate-react/src/components/editable.tsx#L551
     *
     * Reference events we emulate:
     * https://github.com/ianstormtaylor/slate/blob/b5be790f3ebacd4480cc4505e8c32877bab84e29/packages/slate-react/src/components/editable.tsx#L736
     *
     * @param {string} value
     */
    const type = async (value: string) =>
        act(async () => {
            fireEvent(
                textBoxElement,
                new InputEvent('beforeinput', {
                    inputType: 'insertText',
                    data: value,
                }),
            )
        })

    // Doest not work (should use Slate Jsx instead)
    await type('Hallo World')

    // or if you want to test the input field itself
    // expect(textBoxElement).toBe('Ben Mayer')

})
