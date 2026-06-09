/**
 *
 * This is just a demo of the decorator
 * for highlight
 * Slate is not really the good product to do that
 * It demos how you can highlight some text with the decorator
 *
 * https://github.com/ianstormtaylor/slate/blob/main/site/examples/markdown-preview.tsx
 *
 */
import React, {useCallback} from 'react'
import {Editable} from 'slate-react'
import {RenderElementProps, RenderLeafProps} from "slate-react/dist/components/editable";

import {useRichSlate} from "../../src/component/context/useRichSlate.ts";
import {decorateMarkdown} from "../../src/component/renderers/RenderDecorateMarkdown";


const RichSlateMarkdownEditable = () => {

    /**
     * Rich Slate editor object that won't change across renders.
     */
    const richSlate = useRichSlate();

    const decorate = useCallback(decorateMarkdown, [])

    // Update the initial content to be pulled from Local Storage if it exists.
    const renderElement = useCallback((props: RenderElementProps) => richSlate.renderElement(props), [])
    //const renderLeaf = useCallback((props: RenderLeafProps) => richSlate.renderLeaf(props), [])
    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        []
    )

    const onKeyDown = useCallback((event: React.KeyboardEvent) => richSlate.onKeyDown(event), [])
    const onClick = useCallback((event: React.MouseEvent) => richSlate.onClick(event), [])
    const onDoubleClick = useCallback((event: React.MouseEvent) => richSlate.onDoubleClick(event), [])
    const onDomBeforeInput = useCallback((event: InputEvent) => richSlate.onDomBeforeInput(event), [])
    /**
     * <Slate> is a context provider.
     * It:
     * * keeps track of the editor state (plugins, value, selection), and any changes that occur.
     * * provide the editor state to other components like toolbars, menus, etc. . using the useSlate hook
     *
     * Richtext documents are complex (with toolbars, or live previews, ...) next to the editable content
     * By having a shared context, those other components can execute commands, query the editor's state, etc.
     */
    /**
     * <Editable>: Render the editable. It acts like contenteditable;
     * It will render an editable Richtext document for the nearest editor context.
     */
    return (
        <Editable
            spellCheck
            autoFocus
            decorate={decorate}
            // Pass in the `renderElement` function.
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onDOMBeforeInput={onDomBeforeInput}
            placeholder="Write some markdown..."
        />
    )
}

const Leaf = ({attributes, children, leaf}: RenderLeafProps) => {

    // @ts-ignore
    const tokenType = leaf.mdTokenType
    return (
        <span
            {...attributes}
            // @ts-ignore
            data-md-token-type={tokenType}
            style={
                {
                    fontWeight: tokenType == 'bold' ? 'bold' : 'normal',
                    fontStyle: tokenType == 'italic' ? 'italic' : '',
                    textDecoration: tokenType == 'underlined' ? 'underline' : ''
                }
            }>
      {children}
    </span>
    )
}


export default RichSlateMarkdownEditable
