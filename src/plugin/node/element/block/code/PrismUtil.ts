/**
 *
 * Copied from:
 * * from Slate repo:
 * * prism-react-renderer repo: https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/utils/normalizeTokens.js
 *
 * See an easier implementation with decorate:
 * https://github.com/ianstormtaylor/slate/blob/v0.47/examples/code-highlighting/index.js
 *
 * See also this component:
 * https://github.com/resend/react-email/blob/canary/packages/code-block/readme.md
 **/

import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-java'
import {Descendant, Editor, Node as SlateNode, NodeEntry, Path} from "slate";
import {useSlate} from "slate-react";
import {useCallback} from "react";
import {TagCodeLang, TagCodeLangElement} from "./TagCodeLang";
import {TagCodeLangLine} from "./TagCodeLangLine";

type PrismToken = Prism.Token
type Token = {
    types: string[]
    content: string
    empty?: boolean
}

const newlineRe = /\r\n|\r|\n/

// Empty lines need to contain a single empty token, denoted with { empty: true }
const normalizeEmptyLines = (line: Token[]) => {
    if (line.length === 0) {
        line.push({
            types: ['plain'],
            content: '\n',
            empty: true,
        })
    } else if (line.length === 1 && line[0].content === '') {
        line[0].content = '\n'
        line[0].empty = true
    }
}

const appendTypes = (types: string[], add: string[] | string): string[] => {
    const typesSize = types.length
    if (typesSize > 0 && types[typesSize - 1] === add) {
        return types
    }

    return types.concat(add)
}

// Takes an array of Prism's tokens and groups them by line, turning plain
// strings into tokens as well. Tokens can become recursive in some cases,
// which means that their types are concatenated. Plain-string tokens however
// are always of type "plain".
// This is not recursive to avoid exceeding the call-stack limit, since it's unclear
// how nested Prism's tokens can become
export const normalizeTokens = (
    tokens: Array<PrismToken | string>
): Token[][] => {
    const typeArrStack: string[][] = [[]]
    const tokenArrStack = [tokens]
    const tokenArrIndexStack = [0]
    const tokenArrSizeStack = [tokens.length]

    let i = 0
    let stackIndex = 0
    let currentLine: any[] = []

    const acc = [currentLine]

    while (stackIndex > -1) {
        while (
            (i = tokenArrIndexStack[stackIndex]++) < tokenArrSizeStack[stackIndex]
            ) {
            let content
            let types = typeArrStack[stackIndex]

            const tokenArr = tokenArrStack[stackIndex]
            const token = tokenArr[i]

            // Determine content and append type to types if necessary
            if (typeof token === 'string') {
                types = stackIndex > 0 ? types : ['plain']
                content = token
            } else {
                types = appendTypes(types, token.type)
                if (token.alias) {
                    types = appendTypes(types, token.alias)
                }

                content = token.content
            }

            // If token.content is an array, increase the stack depth and repeat this while-loop
            if (Array.isArray(content)) {
                stackIndex++
                typeArrStack.push(types)
                tokenArrStack.push(content)
                tokenArrIndexStack.push(0)
                tokenArrSizeStack.push(content.length)
                continue
            }

            if (typeof content !== 'string') {
                throw new Error("Content should be a string")
            }

            // Split by newlines
            const splitByNewlines = content.split(newlineRe)
            const newlineCount = splitByNewlines.length

            currentLine.push({types, content: splitByNewlines[0]})

            // Create a new line for each string on a new line
            for (let i = 1; i < newlineCount; i++) {
                normalizeEmptyLines(currentLine)
                acc.push((currentLine = []))
                currentLine.push({types, content: splitByNewlines[i]})
            }
        }

        // Decreate the stack depth
        stackIndex--
        typeArrStack.pop()
        tokenArrStack.pop()
        tokenArrIndexStack.pop()
        tokenArrSizeStack.pop()
    }

    normalizeEmptyLines(currentLine)
    return acc
}

const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<TagCodeLangElement>) => {

    const nodeToDecorations = new Map<Descendant, Range[]>()

    const text = block.children.map(line => SlateNode.string(line)).join('\n')
    const language = block.language
    const tokens = Prism.tokenize(text, Prism.languages[language])
    const normalizedTokens = normalizeTokens(tokens) // make tokens flat and grouped by line
    const blockChildren = block.children as Descendant[]

    for (let index = 0; index < normalizedTokens.length; index++) {
        const tokens = normalizedTokens[index]
        const element = blockChildren[index]

        if (!nodeToDecorations.has(element)) {
            nodeToDecorations.set(element, [])
        }

        let start = 0
        for (const token of tokens) {
            const length = token.content.length
            if (!length) {
                continue
            }

            const end = start + length

            const path = [...blockPath, index, 0]
            const range = {
                anchor: {path, offset: start},
                focus: {path, offset: end},
                token: true,
                ...Object.fromEntries(token.types.map(type => [type, true])),
            }

            // @ts-ignore
            nodeToDecorations.get(element)!.push(range)

            start = end
        }
    }

    return nodeToDecorations
}

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
    const map = new Map<K, V>()

    for (const m of maps) {
        for (const item of m) {
            map.set(...item)
        }
    }

    return map
}

// precalculate editor.nodeToDecorations map to use it inside decorate function then
export const CodeBlockCapture = () => {

    const editor = useSlate()

    const blockEntries: NodeEntry<TagCodeLangElement>[] = Array.from(
        Editor.nodes(editor, {
            at: [],
            mode: 'highest',
            match: n => TagCodeLang.isCodeBlockElement(n),
        })
    )

    // @ts-ignore
    editor.nodeToDecorations = mergeMaps(
        ...blockEntries.map(getChildNodeToDecorations)
    )

    return null
}


// Prismjs theme stored as a string instead of emotion css function.
// It is useful for copy/pasting different themes. Also lets keeping simpler Leaf implementation
// In the real project better to use just css file
export const prismThemeCss = `
/**
 * prism.js default theme for JavaScript, CSS and HTML
 * Based on dabblet (http://dabblet.com)
 * @author Lea Verou
 */

code[class*="language-"],
pre[class*="language-"] {
    color: black;
    background: none;
    text-shadow: 0 1px white;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
}

pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
    text-shadow: none;
    background: #b3d4fc;
}

pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
code[class*="language-"]::selection, code[class*="language-"] ::selection {
    text-shadow: none;
    background: #b3d4fc;
}

@media print {
    code[class*="language-"],
    pre[class*="language-"] {
        text-shadow: none;
    }
}

/* Code blocks */
pre[class*="language-"] {
    padding: 1em;
    margin: .5em 0;
    overflow: auto;
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
    background: #f5f2f0;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
    padding: .1em;
    border-radius: .3em;
    white-space: normal;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
    color: slategray;
}

.token.punctuation {
    color: #999;
}

.token.namespace {
    opacity: .7;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
    color: #905;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
    color: #690;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
    color: #9a6e3a;
    /* This background color was intended by the author of this theme. */
    background: hsla(0, 0%, 100%, .5);
}

.token.atrule,
.token.attr-value,
.token.keyword {
    color: #07a;
}

.token.function,
.token.class-name {
    color: #DD4A68;
}

.token.regex,
.token.important,
.token.variable {
    color: #e90;
}

.token.important,
.token.bold {
    font-weight: bold;
}
.token.italic {
    font-style: italic;
}

.token.entity {
    cursor: help;
}
`
