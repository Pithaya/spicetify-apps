// Note: Kuroshiro intellisense is broken...
// see: https://stackoverflow.com/questions/71541240/mapping-a-relative-path-import-to-the-right-types-in-typescript
import Kuroshiro from '../node_modules/kuroshiro/dist/kuroshiro.min.js';
import KuromojiAnalyzer from '../node_modules/kuroshiro-analyzer-kuromoji/dist/kuroshiro-analyzer-kuromoji.min.js';
import SpotifyWebApi from 'spotify-web-api-js';

const kuroshiro: Kuroshiro = new Kuroshiro();
const analyzer: KuromojiAnalyzer = new KuromojiAnalyzer({
    dictPath: 'extensions/node_modules/kuromoji/dict',
});
const spotifyApi = new SpotifyWebApi();

async function getName(uri: string): Promise<string> {
    console.log(uri);

    // string format will be "spotify:{type}:{id}"
    const split = uri.split(':');
    const type = split[1];
    const id = split[2];

    let name = '';
    switch (type) {
        case Spicetify.URI.Type.TRACK:
            name = (await spotifyApi.getTrack(id)).name;
            break;
        case Spicetify.URI.Type.ALBUM:
            name = (await spotifyApi.getAlbum(id)).name;
            break;
        case Spicetify.URI.Type.ARTIST:
            name = (await spotifyApi.getArtist(id)).name;
            break;
        case Spicetify.URI.Type.SHOW:
            name = (await spotifyApi.getShow(id)).name;
            break;
        case Spicetify.URI.Type.EPISODE:
            name = (await spotifyApi.getEpisode(id)).name;
            break;
        case Spicetify.URI.Type.PLAYLIST:
        case Spicetify.URI.Type.PLAYLIST_V2:
            name = (await spotifyApi.getPlaylist(id)).name;
            break;
    }

    return name;
}

async function convert(
    uris: string[],
    to: 'hiragana' | 'katakana' | 'romaji'
): Promise<void> {
    let name = await getName(uris[0]);

    if (Kuroshiro.Util.hasJapanese(name)) {
        name = await kuroshiro.convert(name, {
            to: to,
            mode: 'spaced',
            romajiSystem: 'passport',
        });
        name = name.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
    }

    Spicetify.showNotification(name);
}

async function main(): Promise<void> {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Init dependencies
    await kuroshiro.init(analyzer);
    spotifyApi.setAccessToken(
        (Spicetify.Platform.Session as Spicetify.Platform.Session).accessToken
    );

    // Register menu item
    new Spicetify.ContextMenu.Item('Show Romaji', (uris) =>
        convert(uris, 'romaji')
    ).register();

    new Spicetify.ContextMenu.Item('Show Hiragana', (uris) =>
        convert(uris, 'hiragana')
    ).register();
}

export default main;
