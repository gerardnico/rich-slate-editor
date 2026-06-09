import Osy from "./Osy.ts";


export default class HotKey {


    /**
     * Translate `mod` in a hotkey to `Ctrl` or `Cmd`
     * depending on the OS to put on a title attribute
     * of an element
     * @param hotKey
     */
    static toHumanDescription(hotKey: string): string {

        const osName = Osy.getOs() || 'Windows'
        if (osName === "Mac") {
            return hotKey.replace('mod', 'Cmd')
        }
        return hotKey.replace('mod', 'Ctrl')

    }

}
