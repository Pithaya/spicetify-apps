import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from '../../node_modules/kuroshiro-analyzer-kuromoji/dist/kuroshiro-analyzer-kuromoji.min.js';

type ExtendedXMLHttpRequest = XMLHttpRequest & {
    patched_open: (method: string, url: string) => void;
};

const dictPath = 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict';

/**
 * Fix an issue with kuromoji when loading dict from external urls
 * See: https://github.com/takuyaa/kuromoji.js/issues/37
 * Adapted from: https://github.com/mobilusoss/textlint-browser-runner/pull/7
 */
export function applyKuromojiFix(): void {
    if (/https?:\/\//.test(dictPath)) {
        var dicPathWithoutDoubleSlash = dictPath.replace('://', ':/');

        (XMLHttpRequest.prototype as ExtendedXMLHttpRequest).patched_open =
            XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method: string, url: string) {
            if (url.indexOf(dicPathWithoutDoubleSlash) === 0) {
                (this as ExtendedXMLHttpRequest).patched_open(
                    method,
                    url.replace(dicPathWithoutDoubleSlash, dictPath)
                );
            } else {
                (this as ExtendedXMLHttpRequest).patched_open(method, url);
            }
        };
    }
}

export async function createKuroshiro(): Promise<Kuroshiro> {
    applyKuromojiFix();

    const kuroshiro: Kuroshiro = new Kuroshiro();
    const analyzer: KuromojiAnalyzer = new KuromojiAnalyzer({
        dictPath: dictPath,
    });

    await kuroshiro.init(analyzer);

    return kuroshiro;
}
