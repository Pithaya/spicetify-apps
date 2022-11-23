import KuroshiroModule from '../node_modules/kuroshiro/dist/kuroshiro.min.js';
import KuromojiAnalyzerModule from '../node_modules/kuroshiro-analyzer-kuromoji/dist/kuroshiro-analyzer-kuromoji.min.js';

async function main (): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    while (!Spicetify?.showNotification) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const kuroshiro: Kuroshiro = new KuroshiroModule();
    const analyzer: KuromojiAnalyzer = new KuromojiAnalyzerModule({ dictPath: 'extensions/node_modules/kuromoji/dict' });

    await kuroshiro.init(analyzer);

    const result = await kuroshiro.convert('感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！', { to: 'hiragana' });

    // Show message on start.
    Spicetify.showNotification(result);
}

export default main;
