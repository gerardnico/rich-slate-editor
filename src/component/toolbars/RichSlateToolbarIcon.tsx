import {FontIcon, FontIconType, FontName} from "@/component/ui/icon/FontIcon.tsx";


export function RichSlateToolbarIcon({iconName, ...props}: FontIconType) {

    const fontName: FontName = props.fontName ? props.fontName : (import.meta.env.ICON_FONT as FontName || 'bootstrap-icons')
    switch (fontName) {
        case 'material-icons':
            /**
             * The icon code points are in the children
             * as characters or ligature
             * <p>
             * Material icon characters are in the children
             * https://developers.google.com/fonts/docs/material_icons#using_the_icons_in_html
             * https://fonts.google.com/icons
             */
            switch (iconName) {
                case "h1": {
                    iconName = "looks_one";
                    break;
                }
                case "h2": {
                    iconName = "looks_two";
                    break;
                }
                case "underline": {
                    iconName = `format_underlined`;
                    break;
                }
                case "italic":
                case "bold": {
                    iconName = `format_${iconName}`;
                    break;
                }
                case "align-left": {
                    iconName = "format_align_left";
                    break;
                }
                case "align-right": {
                    iconName = "format_align_right";
                    break;
                }
                case "align-center": {
                    iconName = "format_align_center";
                    break;
                }
                case "align-justify": {
                    iconName = "format_align_justify";
                    break;
                }
            }
            break;
        default:
        case 'bootstrap-icons':
            switch (iconName) {
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                case "underline":
                case "italic":
                case "bold": {
                    iconName = `type-${iconName}`;
                    break;
                }
                case "list-ol":
                case "list-ul":
                    break;
                case "align-left":
                case "align-right":
                case "align-center":
                    iconName = iconName.replace("align", "text")
                    break;
                case "align-justify":
                    iconName = iconName.replace("align-", "")
                    break;
                case "undo":
                    // iconName = "arrow-counterclockwise"
                    // iconName = "arrow-90deg-left"
                    iconName = "caret-left"
                    break;
                case "redo":
                    // iconName = "arrow-clockwise"
                    // iconName = "arrow-90deg-right"
                    iconName = "caret-right"
                    break;
                case "variable": {
                    iconName = "currency-dollar";
                    break;
                }
            }
            break;
    }
    return (<FontIcon
            {...props}
            fontName={fontName}
        >{iconName}</FontIcon>
    )

}
