import React from 'react'
import ReactDOM from 'react-dom/client'
import {RichSlateTextArea} from "../../src/component/form/RichSlateTextArea.tsx";

/**
 * We create the root not in the SlateEditorComponent
 * to not have a reload during dev
 * Otherwise we get the warning:
 * Warning: You are calling ReactDOMClient.createRoot() on a container
 * that has already been passed to createRoot() before.
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RichSlateTextArea name={'rich-slate-app'}/>
    </React.StrictMode>,
)
