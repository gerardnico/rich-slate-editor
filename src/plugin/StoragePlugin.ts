import {Descendant} from "slate";
import {RichSlatePlugin} from "./RichSlatePlugin.tsx";

/**
 * A storage plugin
 */
export abstract class StoragePlugin extends RichSlatePlugin {

    abstract store(descendant: Descendant[]): void;

    abstract retrieve(): Descendant[] | null

}
