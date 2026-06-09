import {BaseEditor} from "slate";
import {ReactEditor} from "slate-react";
import {RichSlatePlugin} from "../../RichSlatePlugin.tsx";


/**
 * SoftBreak is now a Slate function
 * See soft break function of {@link BaseEditor}
 */
export class SoftBreakSlatePlugin extends RichSlatePlugin {


    mount<T extends ReactEditor>(): ReactEditor|null {

        /**
         * SoftBreak is now in Slate
         * A different behavior for inserting a soft break with shift+enter is quite common in rich text editors.
         * Right now you have to do this in onKeyDown which is not so nice.
         * This adds a separate insertSoftBreak method on the editor instance
         * that gets called when a soft break is inserted.
         * This maintains the current default behavior for backwards compatibility (it just splits the block).
         * But at least you can easily overwrite it now.
         * https://github.com/ianstormtaylor/slate/commit/20acca4bc8f31bd1aa6fbca2c49aaae5f31cadfe
         * https://github.com/ianstormtaylor/slate/pull/4873
         */
        //return editor;
        return null;

    }

    getName(): string {
        return "SoftBreak";
    }

}
