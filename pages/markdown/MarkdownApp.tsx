import React from 'react'
import ReactDOM from 'react-dom/client'

import {RichSlateMarkdownEditor} from "./RichSlateMarkdownEditor.tsx";

/**
 * We create the root not in the MarkdownEditor
 * to not have a reload during dev
 * Otherwise we get the warning:
 * Warning: You are calling ReactDOMClient.createRoot() on a container
 * that has already been passed to createRoot() before.
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RichSlateMarkdownEditor name={'Markdown'}/>
    </React.StrictMode>,
)
