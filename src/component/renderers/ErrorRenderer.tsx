import {RenderElementProps} from "slate-react/dist/components/editable";
import {useSlateStatic} from "slate-react";


export function ErrorRenderer({message, children, element, attributes}: RenderElementProps & { message: string }) {
    const editor = useSlateStatic()
    let inline = editor.isInline(element);
    const Tag = inline ? 'span' : 'p';
    return (
        <>
            <Tag className={'text-alert'} {...attributes}>{message}</Tag>
            {children}
        </>
    );
}
