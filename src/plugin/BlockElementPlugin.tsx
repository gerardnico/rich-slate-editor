import {ElementPlugin} from "./ElementPlugin";
import {RichSlate} from "../RichSlate";
import {ElementDefBuilder} from "./ElementDefBuilder";


/**
 * A block element can contain inline element and other block element
 * All elements default to being "block" elements.
 *
 * They each appear separated by vertical space, and they never run into each other.
 *
 * This is the default of Slate
 */
export abstract class BlockElementPlugin extends ElementPlugin {

    constructor(name: string, richSlate: RichSlate, elementDefSet?: (() => ElementDefBuilder[])) {
        super(name, richSlate, () => {
            if (elementDefSet !== undefined) {
                return elementDefSet();
            }
            return [
                new ElementDefBuilder(name).setIsInline(false)
            ];
            }
        );
    }

}
