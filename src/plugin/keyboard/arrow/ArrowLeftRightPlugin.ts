import {RichSlatePlugin} from "../../RichSlatePlugin.tsx";
import React from "react";
import isHotkey from "is-hotkey";
import {Range as SlateRange, Transforms} from "slate";
import {RichSlate} from "../../../RichSlate.tsx";

/**
 * Allow to step out/in of inline element
 * (Same behavior as Google Doc)
 *
 * Default left/right behavior is unit: 'character'.
 * This fails to distinguish between two cursor positions, such as
 * <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
 * Here we modify the behavior to unit: 'offset'.
 * This lets the user step into and out of the inline element without stepping over characters.
 *
 * See https://github.com/ianstormtaylor/slate/pull/4578#issuecomment-947643779
 */
export class ArrowLeftRightPlugin extends RichSlatePlugin {

    static NAME = "arrow-left-right";


    constructor(name: string, richSlate: RichSlate) {
        super(name, richSlate);

        richSlate.addOnKeyDownHandler({
            plugin: this,
            name: 'default',
            handler: (event: React.KeyboardEvent) => {
                const editor = this.getSlateEditor();
                const {selection} = editor;
                if (!(selection && SlateRange.isCollapsed(selection))) {
                    return;
                }
                const isLeft = isHotkey('left', event)
                if (isLeft) {
                    event.preventDefault()
                    Transforms.move(editor, {unit: 'offset', reverse: true})
                    return
                }
                const isRight = isHotkey('right', event)
                if (isRight) {
                    event.preventDefault()
                    Transforms.move(editor, {unit: 'offset'})
                    return
                }
            }
        })
    }
}
