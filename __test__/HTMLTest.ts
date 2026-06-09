import * as prettier from "prettier";


export class HTMLTest {
    static prettyPrint = (html: string) => {
        /**
         * https://prettier.io/docs/en/api.html
         */
        return prettier.format(html, {parser: "html"});
    }
}
