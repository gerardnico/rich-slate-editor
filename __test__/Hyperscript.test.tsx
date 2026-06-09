/// <reference path="jsxIntrinsicElement.d.ts" />
/** @jsx jsx */
/** @jsxRuntime classic */
import {jsx} from './jsxFactory'
import {expect, test} from "vitest";


/**
 * Testing
 * https://docs.slatejs.org/concepts/10-serializing#deserializing
 */
test('Documentation Fragment', () => {

    const input = (
        <fragment>
            <element type="paragraph">A line of text.</element>
        </fragment>
    )

    console.log(JSON.stringify(input));

})



test('Test self and Source are not there', () => {

    // With the vite-react plugin, using classic or another configuration
    // we may get self and source, testing that this is not the case
    // https://babeljs.io/docs/babel-plugin-transform-react-jsx-self.html
    // https://babeljs.io/docs/babel-plugin-transform-react-jsx-source.html
    const output = (
        <editor></editor>
    )

    expect('__self' in output).toBeFalsy()
    expect('__source' in output).toBeFalsy()

});
