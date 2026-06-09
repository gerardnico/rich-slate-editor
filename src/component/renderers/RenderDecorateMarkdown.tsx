import {Node, Range, Text} from "slate";
import Prism from "prismjs";
import 'prismjs/components/prism-markdown'


export const decorateMarkdown = ([node, path]: [node: Node, path: any]) => {

    const ranges: Range[] = [];

    if (!Text.isText(node)) {
        return ranges;
    }

    const getLength = (token: string | Prism.Token): number => {
        if (typeof token === 'string') {
            return token.length
        } else if (typeof token.content === 'string') {
            return token.content.length
        } else {
            // @ts-ignore
            return token.content.reduce((l, t) => l + getLength(t), 0)
        }
    }
    const tokens = Prism.tokenize(node.text, Prism.languages.markdown)
    let start = 0
    for (const token of tokens) {

        const length = getLength(token)
        const end = start + length

        if (typeof token !== 'string') {
            ranges.push({
                // @ts-ignore
                mdTokenType: token.type,
                anchor: {path, offset: start},
                focus: {path, offset: end},
            })
        }
        start = end
    }

    return ranges
}
