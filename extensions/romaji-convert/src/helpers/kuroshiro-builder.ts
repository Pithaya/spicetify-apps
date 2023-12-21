const kuroshiroPath =
    'https://cdn.jsdelivr.net/npm/kuroshiro@1.2.0/dist/kuroshiro.min.js';
const kuromojiPath =
    'https://cdn.jsdelivr.net/npm/kuroshiro-analyzer-kuromoji@1.1.0/dist/kuroshiro-analyzer-kuromoji.min.js';

const dictPath = 'https:/cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict';

type ExtendedXMLHttpRequest = XMLHttpRequest & {
    realOpen: (method: string, url: string | URL, async: boolean) => void;
};

export class KuroshiroBuilder {
    constructor() {
        this.addScript(kuroshiroPath);
        this.addScript(kuromojiPath);
    }

    public async createKuroshiro(): Promise<Kuroshiro> {
        // Wait for JSDeliver to load Kuroshiro and Kuromoji
        while (
            typeof Kuroshiro === 'undefined' ||
            typeof KuromojiAnalyzer === 'undefined'
        ) {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // eslint-disable-next-line new-cap
        const kuroshiro = new (Kuroshiro as any).default();

        this.applyKuromojiFix();

        await kuroshiro.init(new KuromojiAnalyzer({ dictPath }));

        return kuroshiro;
    }

    /**
     * Fix an issue with kuromoji when loading dict from external urls
     * See: https://github.com/takuyaa/kuromoji.js/issues/37
     * Adapted from: https://github.com/mobilusoss/textlint-browser-runner/pull/7
     */
    private applyKuromojiFix(): void {
        const prototype = XMLHttpRequest.prototype as ExtendedXMLHttpRequest;

        if (typeof prototype.realOpen !== 'undefined') {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/unbound-method
        prototype.realOpen = prototype.open;

        (prototype as any).open = function (
            method: string,
            url: string,
            async: boolean,
        ) {
            if (url.indexOf(dictPath.replace('https://', 'https:/')) === 0) {
                this.realOpen(
                    method,
                    url.replace('https:/', 'https://'),
                    async,
                );
            } else {
                this.realOpen(method, url, async);
            }
        };
    }

    private addScript(url: string): void {
        if (document.body.querySelector(`script[src='${url}']`) !== null) {
            // script already added by another extension
            return;
        }

        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);

        document.body.prepend(script);
    }
}
