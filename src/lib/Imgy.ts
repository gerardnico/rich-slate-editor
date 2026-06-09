import imageExtensions from 'image-extensions'


/**
 * Utility class for Image
 */
export class Imgy {

    static isImageUrl = (url: URL) => {
        if (!url) return false
        const ext = url.pathname.split('.').pop()
        if (typeof ext == 'undefined') {
            return false;
        }
        return imageExtensions.includes(ext)
    }

}
