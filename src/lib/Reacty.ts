import React, {CSSProperties, HTMLAttributes, ReactElement} from "react";


/**
 * A recursive function that extracts the text from a React Node
 * @param node - the node
 */
function extractTextFromNodeRecursively(node: React.ReactNode): string {

    // Return empty string if the node is empty or undefined
    if (node === undefined || node === null) {
        return '';
    }

    if (Array.isArray(node)) {
        // If it's an array, map each item and join them
        return node.map(extractTextFromNodeRecursively).join(' ');
    }

    // React element, React Fragment, React Portal
    if (React.isValidElement(node)) {
        if (node.props && node.props.children) {
            // Recursively extract text from children
            return extractTextFromNodeRecursively(node.props.children);
        }
        // element without children
        return '';
    }

    // string, number, boolean
    return String(node);

}

const CLASS_NAME_KEY = 'className';

type classNameType = HTMLAttributes<never>['className'];

/**
 * Utility class for React
 */
export class Reacty {

    /**
     * Extract the text
     * @param value - a React node or a string
     */
    static extractText = function (value: React.ReactNode | string): string {
        return extractTextFromNodeRecursively(value);
    }


    static getClassNameOrDefault(className: string | undefined, defaultClassName: string) {
        if (className === undefined) {
            return defaultClassName;
        }
        return className;
    }


}
