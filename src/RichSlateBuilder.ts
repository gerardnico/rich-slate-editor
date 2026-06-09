import {RichSlate} from "./RichSlate";
import {ISlatePluginBuilder} from "./plugin/ISlatePluginBuilder";
import {BaseEditor, Descendant, Editor} from "slate";
import {ReactEditor} from "slate-react";
import {HistoryEditor} from "slate-history";
import {HistoryPluginBuilder} from "./plugin/history/HistoryPluginBuilder";
import {PElementPluginBuilder} from "./plugin/node/element/block/paragraph/PElementPluginBuilder";
import {ArrowLeftRightPluginBuilder} from "./plugin/keyboard/arrow/ArrowLeftRightPluginBuilder.ts";
import {LocalStoragePluginBuilder} from "./plugin/persist/local-storage/LocalStoragePluginBuilder.ts";


export class RichSlateBuilder {


    readonly name: string;
    editor: (BaseEditor & ReactEditor & HistoryEditor) | undefined;
    enableHistory: boolean = true;
    initialValue: Descendant[] | null = null;

    constructor(name: string) {
        this.name = name;

        /**
         * Built-in plugin
         * P is mandatory because it's the first element to be found
         * when there is no content
         * History is mandatory
         */
        const pElementPlugin = new PElementPluginBuilder();
        this.pluginBuilders.set(pElementPlugin.getName(), pElementPlugin);
        const arrowPluginBuilder = new ArrowLeftRightPluginBuilder();
        this.pluginBuilders.set(arrowPluginBuilder.getName(), arrowPluginBuilder);
        const localStorageBuilder = new LocalStoragePluginBuilder();
        this.pluginBuilders.set(localStorageBuilder.getName(), localStorageBuilder);

    }

    pluginBuilders = new Map<string, ISlatePluginBuilder>();

    withEditor(editor: Editor) {
        this.editor = editor as (BaseEditor & ReactEditor & HistoryEditor);
        return this;
    }

    enableHistoryPlugin() {
        this.enableHistory = true;
        return this;
    }

    disableHistoryPlugin() {
        this.enableHistory = false;
        return this;
    }

    registerPlugin(pluginBuilder: ISlatePluginBuilder) {
        this.pluginBuilders.set(pluginBuilder.getName(), pluginBuilder);
        return this;
    }

    build() {
        if (this.enableHistory) {
            const historyPluginBuilder = new HistoryPluginBuilder();
            this.pluginBuilders.set(historyPluginBuilder.getName(), historyPluginBuilder);
        }
        return new RichSlate(this);
    }

    setInitialValue(initialValue: Descendant[] | null) {
        this.initialValue = initialValue;
        return this;
    }

}
