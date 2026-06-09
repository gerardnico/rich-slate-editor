import {ElementPlugin} from "./ElementPlugin";
import {RichSlate} from "../RichSlate";
import {ElementDefBuilder} from "./ElementDefBuilder";


export abstract class InlineElementPlugin extends ElementPlugin {


    constructor(name: string, richSlate: RichSlate, elementDefSet?: (() => ElementDefBuilder[])) {
        super(name, richSlate, elementDefSet !== undefined ? elementDefSet :
            () => {
                return [new ElementDefBuilder(name).setIsInline(true)]
            }
        );
    }


}
