import {RichSlate} from "../../../RichSlate.tsx";
import {Descendant} from "slate";
import {StoragePlugin} from "../../StoragePlugin.ts";


export class LocalStoragePlugin extends StoragePlugin {

    static NAME = 'local-storage';

    constructor(name: string, richSlate: RichSlate) {
        super(name, richSlate);


    }

    /**
     * Save the value to Local Storage.
     * @param descendant
     */
    store(descendant: Descendant[]) {
        const content = JSON.stringify(descendant)
        localStorage.setItem(this.getRichSlate().getName(), content)
    }

    retrieve(): Descendant[] | null {
        let value = localStorage.getItem(this.getRichSlate().getName());
        if (!value || value === '') {
            return null
        }
        return JSON.parse(value);
    }

}
