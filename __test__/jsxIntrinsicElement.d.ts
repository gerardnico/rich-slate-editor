// This allows tests to include Slate Nodes written in JSX without TypeScript complaining.
// https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements
// https://www.typescriptlang.org/tsconfig#jsxFactory
//
// Because the factor is defined to be jsx, it will check for jsx.JSX before a global JSX

declare namespace jsx.JSX {

    interface IntrinsicElements {
        [elemName: string]: any // eslint-disable-line
        // text: FormattedText
        // paragraph: any
        // editor: any
    }

}
