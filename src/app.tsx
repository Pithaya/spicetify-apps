import KuroshiroModule from '../node_modules/kuroshiro/dist/kuroshiro.min.js';
import KuromojiAnalyzerModule from '../node_modules/kuroshiro-analyzer-kuromoji/dist/kuroshiro-analyzer-kuromoji.min.js';
import { registerExtensions } from './spicetify-extensions.js';

const kuroshiro: Kuroshiro = new KuroshiroModule();
const analyzer: KuromojiAnalyzer = new KuromojiAnalyzerModule({
    dictPath: 'extensions/node_modules/kuromoji/dict',
});

const fetchAlbum = async (uri: string): Promise<any> => {
    const res = await Spicetify.CosmosAsync.get(
        `hm://album/v1/album-app/album/${uri.split(':')[2]}/desktop`
    );
    return res.name;
};

const fetchShow = async (uri: string): Promise<any> => {
    const res = await Spicetify.CosmosAsync.get(
        `sp://core-show/v1/shows/${
            uri.split(':')[2]
        }?responseFormat=protobufJson`,
        {
            policy: { list: { index: true } },
        }
    );
    return res.header.showMetadata.name;
};

const fetchArtist = async (uri: string): Promise<any> => {
    const res = await Spicetify.CosmosAsync.get(
        `hm://artist/v1/${uri.split(':')[2]}/desktop?format=json`
    );
    return res.info.name;
};

const fetchTrack = async (uri: string): Promise<any> => {
    const res = await Spicetify.CosmosAsync.get(
        `https://api.spotify.com/v1/tracks/${uri.split(':')[2]}`
    );
    return res.name;
};

const fetchEpisode = async (uri: string): Promise<any> => {
    const res = await Spicetify.CosmosAsync.get(
        `https://api.spotify.com/v1/episodes/${uri.split(':')[2]}`
    );
    return res.name;
};

const fetchPlaylist = async (uri: string): Promise<any> => {
    const res = await Spicetify.CosmosAsync.get(
        `sp://core-playlist/v1/playlist/${uri}/metadata`,
        {
            policy: { name: true },
        }
    );
    return res.metadata.name;
};

async function getName(uri: string): Promise<string> {
    const type = uri.split(':')[1];
    let name;
    switch (type) {
        case Spicetify.URI.Type.TRACK:
            name = await fetchTrack(uri);
            break;
        case Spicetify.URI.Type.ALBUM:
            name = await fetchAlbum(uri);
            break;
        case Spicetify.URI.Type.ARTIST:
            name = await fetchArtist(uri);
            break;
        case Spicetify.URI.Type.SHOW:
            name = await fetchShow(uri);
            break;
        case Spicetify.URI.Type.EPISODE:
            name = await fetchEpisode(uri);
            break;
        case Spicetify.URI.Type.PLAYLIST:
        case Spicetify.URI.Type.PLAYLIST_V2:
            name = await fetchPlaylist(uri);
            break;
    }

    return name;
}

async function convert(uris: string[]): Promise<void> {
    let name = await getName(uris[0]);

    // TODO: Fix type definitions
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (KuroshiroModule.Util.hasJapanese(name)) {
        name = await kuroshiro.convert(name, {
            to: 'romaji',
            mode: 'spaced',
            romajiSystem: 'passport',
        });
        name = name.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
    }

    Spicetify.showNotification(name);
}

async function main(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await kuroshiro.init(analyzer);

    registerExtensions();
    Spicetify.CosmosAsync.registerProxy();

    new Spicetify.ContextMenu.Item(
        'Show Romaji',
        convert as Spicetify.ContextMenu.OnClickCallback
    ).register();
}

export default main;
