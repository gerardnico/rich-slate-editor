export interface RichSlatePluginI {

    /**
     * Return a unique key name
     * For leaf (text block), this is a unique styling property (bold, italic, ...)
     * For block, this is the equivalent of the element type name (h1, h2, ...)
     */
    getName(): string;


}
