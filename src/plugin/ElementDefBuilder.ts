import {IElementDef} from "./IElementDef";
import {ElementPlugin} from "./ElementPlugin";


// noinspection JSUnusedGlobalSymbols
export class ElementDefBuilder {

    private readonly name: string;

    private isVoid: boolean = false;
    private isInline: boolean = false;
    private isRoot: boolean = true;
    private isMarkableVoid: boolean = false;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * In a "void" element, the children
     * are rendered by the Element's render code.
     * @param b
     */
    setIsVoid(b: boolean) {
        this.isVoid = b;
        return this;
    }

    /**
     * Inline or block (by default block)
     * @param b
     */
    setIsInline(b: boolean) {
        this.isInline = b;
        return this;
    }

    build(plugin: ElementPlugin): IElementDef {
        return {
            getName: () => this.name,
            isVoidElement: () => this.isVoid,
            isInlineElement: () => this.isInline,
            isRootElement: () => this.isRoot,
            isMarkableVoid: () => this.isMarkableVoid,
            getPlugin: () => plugin
        };
    }

    /**
     * In case of composite tags such as list,
     * a root tag is the top tag that contains the other
     * When you delete a composite tag, you need to unwrap up to the root tag
     * (not up to the children)
     * For instance, a `li` is not a root but a `ul` or `ol` is
     * @param b
     */
    setIsRoot(b: boolean) {
        this.isRoot = b;
        return this;
    }

    /**
     * Void elements that accept marks like bold or italic
     * @param boolean
     */
    setIsMarkableVoid(boolean: boolean) {
        this.isMarkableVoid = boolean;
        return this;
    }

}
