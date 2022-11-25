// Note: Kuroshiro intellisense is broken...
// see: https://stackoverflow.com/questions/71541240/mapping-a-relative-path-import-to-the-right-types-in-typescript
import Kuroshiro from '../node_modules/kuroshiro/dist/kuroshiro.min.js';
import KuromojiAnalyzer from '../node_modules/kuroshiro-analyzer-kuromoji/dist/kuroshiro-analyzer-kuromoji.min.js';
import SpotifyWebApi from 'spotify-web-api-js';

import { SettingsSection } from 'spcr-settings';
import { KuroshiroSettings } from './kuroshiro-settings.js';

const kuroshiro: Kuroshiro = new Kuroshiro();
const analyzer: KuromojiAnalyzer = new KuromojiAnalyzer({
    dictPath: 'extensions/node_modules/kuromoji/dict',
});

const spotifyApi = new SpotifyWebApi();

let settings: KuroshiroSettings;
let contextMenuItem: Spicetify.ContextMenu.Item | null = null;

// 'languages' icon from Lucide
const menuIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" role="img" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>`;

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

async function convert(uris: string[]): Promise<void> {
    let name = await getName(uris[0]);

    if (Kuroshiro.Util.hasJapanese(name)) {
        name = await kuroshiro.convert(name, {
            to: settings.targetSyllabary,
            mode: settings.conversionMode,
            romajiSystem: settings.romajiSystem,
        });
        name = name.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
    }

    Spicetify.showNotification(name);
}

function updateContextMenuItem(): void {
    if (contextMenuItem != null) {
        contextMenuItem.deregister();
    }

    contextMenuItem = new Spicetify.ContextMenu.Item(
        `Show ${settings.targetSyllabaryLabel}`,
        (uris) => convert(uris),
        () => true,
        menuIcon as any
    );

    contextMenuItem.register();
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

    // Init settings and context menu
    settings = new KuroshiroSettings();
    settings.onTargetSyllabaryChange = updateContextMenuItem;

    updateContextMenuItem();
}

export default main;
