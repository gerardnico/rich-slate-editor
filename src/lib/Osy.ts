export type OsName = 'Windows' | 'Mac' | 'Linux' | 'Android' | 'iOS'

export default class Osy {


    static getOs(): OsName | undefined {

        if (navigator.userAgent.indexOf("Win") != -1) return "Windows";
        if (navigator.userAgent.indexOf("Mac") != -1) return "Mac";
        if (navigator.userAgent.indexOf("Linux") != -1) return "Linux";
        if (navigator.userAgent.indexOf("Android") != -1) return "Android";
        if (navigator.userAgent.indexOf("like Mac") != -1) return "iOS";
        return undefined;

    }

}
