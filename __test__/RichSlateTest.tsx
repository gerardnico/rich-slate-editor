import {act, fireEvent, getByRole, render} from "@testing-library/react";
import {RichSlate} from "../src/RichSlate";
import {RichSlateEditor} from "../src/component/rich-slate/RichSlateEditor";
import {parseHotkey} from "is-hotkey";
import {RichSlateEditable} from "../src/component/rich-slate/RichSlateEditable";

/**
 * Test Utils
 *
 * Adapted from
 * https://github.com/mwood23/slate-test-utils/blob/1934983a9de0f6782c1cd1ddaaaacbc2ae4a3e7e/src/buildTestHarness.tsx#L293
 */

export class RichSlateTest {

    private readonly richSlate: RichSlate;


    constructor(richSlate: RichSlate) {
        this.richSlate = richSlate;
    }

    render() {
        let slateEditor = this.richSlate.getSlateEditor();
        /**
         * Wrapper around {@link ReactDOM.render}
         * that will create the document object
         */
        render(<RichSlateEditor richSlate={this.richSlate}
                                initialValue={slateEditor.children}>
                <RichSlateEditable
                    className={'shadow p-3 mb-5 bg-body rounded focus-ring-light'}
                    placeholder="Starts by writing something"
                />
            </RichSlateEditor>
        )
        return this;
    }

    private getEditableElement() {
        const editableElement = getByRole(document.body, 'textbox');

        // @ts-ignore
        // noinspection JSConstantReassignment
        /**
         * Manually add this because JSDom doesn't implement this and Slate checks for it
         * internally before doing stuff.
         *
         * https://github.com/jsdom/jsdom/issues/1670
         *
         * ReadOnly we ignore it then
         *
         */
        // @ts-ignore
        // noinspection JSConstantReassignment
        editableElement.isContentEditable = true

        return editableElement;
    }

    /**
     * Send a key event to the Editable
     * The editor should be first rendered
     * @param hotkey
     */
    pressKey = async (hotkey: string) => {

        if (document?.body == undefined) {
            if (document?.body === undefined) {
                throw new Error("You should render first")
            }
        }

        const editableElement = this.getEditableElement();


        await act(async () => {
            const eventProps = parseHotkey(hotkey)
            const values = hotkey.split('+')

            fireEvent(
                editableElement,
                new window.KeyboardEvent('keydown', {
                    key: values[values.length - 1],
                    code: `${eventProps.which}`,
                    keyCode: eventProps.which,
                    bubbles: true,
                    ...eventProps,
                }),
            )
        })

        return this;
    }

    /**
     * Inserts a line break at the current selection.
     * Simulates pressing 'Enter' in a contenteditable with Slate.
     */
    pressEnter = async () =>
        act(async () => {

            await this.pressKey('Enter')

            let inputEvent = new InputEvent('beforeinput', {inputType: 'insertParagraph'});
            this.fireEvent(inputEvent)

        })

    private fireEvent = (domEvent: Event) => {
        const element = this.getEditableElement();
        fireEvent(element, domEvent)
    }


    queryEditableElement(selectors: string) {
        if (document?.body === undefined) {
            throw new Error("You should render first")
        }
        return document.querySelector(`div[data-slate-editor="true"] ${selectors}`)
    }

}
