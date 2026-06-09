export class Objecty {


    static deepMerge<T extends object>(source: T, ...sources: T[]): T {

        /**
         * See also https://www.npmjs.com/package/ts-deepmerge
         * Used by Firebase
         */

        if (sources === undefined) return source;
        const nextSource = sources.shift();
        if (nextSource === undefined) return source;

        /**
         * source Object may have readonly properties
         * Error: Cannot assign to read only property 'xxxx' of object
         */
        const newSource: T = {...source} as T;
        for (const key in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, key)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const sourceElement: any = nextSource[key];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const targetElement: any = source[key];
                if (sourceElement instanceof Object && targetElement instanceof Object) {
                    // If both properties are objects, recursively merge them
                    newSource[key] = Objecty.deepMerge({}, targetElement, sourceElement);
                } else {
                    // If not an object, assign the value directly
                    newSource[key] = sourceElement;
                }
            }
        }
        return Objecty.deepMerge(newSource, ...sources);
    }

    /**
     * Return true if the object is empty
     * @param obj - the object
     */
    static isEmpty(obj: object) {
        return Object.keys(obj).length === 0;
    }
}
