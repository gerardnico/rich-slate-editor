import {RichSlatePlugin} from "../../../../RichSlatePlugin.tsx";
import {RichSlate} from "../../../../../RichSlate";
import {ISlatePluginBuilder} from "../../../../ISlatePluginBuilder";
import {VariablePlugin, VariablesObject} from "./VariablePlugin";


export class VariablePluginBuilder implements ISlatePluginBuilder {

    variables: VariablesObject = {};

    getName() {
        return VariablePlugin.NAME;
    }

    /**
     * @param name - name of the variable (the name may change)
     * @param id - the id may not and should be unique
     * @param description - the description
     */
    addVariable(name: string, id: number, description: string) {
        let variable = this.variables[id];
        if (variable) {
            console.error(`The variable id ${id} was already included with the name ${variable.name}`);
        }
        this.variables[id] = {name, id, description};
        return this;
    }

    build(richSlateEditor: RichSlate): RichSlatePlugin {
        if (Object.keys(this.variables).length === 0) {
            // Just for dev
            this.variables = {
                0: {id: 0, name: 'title', description: 'The title of the object'},
                1: {id: 1, name: 'name', description: 'The name of the object'},
                2: {id: 2, name: 'url', description: 'The URL of the object'}
            }
        }
        return new VariablePlugin(VariablePlugin.NAME, richSlateEditor, this.variables);
    }

}
