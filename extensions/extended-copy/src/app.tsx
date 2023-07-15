import {
    Album,
    Artist,
    ClipboardAPI,
    getAlbum,
    getArtist,
    getId,
    getPlaylist,
    getShow,
    Locale,
    Playlist,
    Show,
} from '@shared';
import { Episode, getEpisode, getTrack, Track } from '@spotify-web-api';
import i18next from 'i18next';

// TODO: Uncaught TypeError: Cannot read properties of undefined (reading 'TRACK')
const locale: Locale = (Spicetify as any).Locale;
const supportedTypes = [
    Spicetify.URI.Type.TRACK,
    Spicetify.URI.Type.ALBUM,
    Spicetify.URI.Type.ARTIST,
    Spicetify.URI.Type.PLAYLIST,
    Spicetify.URI.Type.PLAYLIST_V2,
    Spicetify.URI.Type.SHOW,
    Spicetify.URI.Type.EPISODE,
];

async function getData(
    uriString: string
): Promise<Track | Album | Artist | Playlist | Show | Episode | null> {
    const uri: Spicetify.URI = Spicetify.URI.fromString(uriString);
    const id = getId(uri);

    if (Spicetify.URI.isTrack(uri)) {
        return await getTrack(id);
    }

    if (Spicetify.URI.isAlbum(uri)) {
        return await getAlbum(id);
    }

    if (Spicetify.URI.isArtist(uri)) {
        return await getArtist(id);
    }

    if (Spicetify.URI.isPlaylistV1OrV2(uri)) {
        return await getPlaylist(id);
    }

    if (Spicetify.URI.isShow(uri)) {
        return await getShow(id);
    }

    if (Spicetify.URI.isEpisode(uri)) {
        return await getEpisode(id);
    }

    return null;
}

async function getName(uriString: string): Promise<string | null> {
    const uri: Spicetify.URI = Spicetify.URI.fromString(uriString);
    const id = getId(uri);

    if (Spicetify.URI.isTrack(uri)) {
        return (await getTrack(id))?.name ?? null;
    }

    if (Spicetify.URI.isAlbum(uri)) {
        return (await getAlbum(id)).name;
    }

    if (Spicetify.URI.isArtist(uri)) {
        return (await getArtist(id)).info.name;
    }

    if (Spicetify.URI.isPlaylistV1OrV2(uri)) {
        return (await getPlaylist(id)).playlist.name;
    }

    if (Spicetify.URI.isShow(uri)) {
        return (await getShow(id)).header.showMetadata.name;
    }

    if (Spicetify.URI.isEpisode(uri)) {
        return (await getEpisode(id))?.name ?? null;
    }

    return null;
}

function copy(text: string | any): void {
    Spicetify.showNotification(i18next.t('copied'));
    (Spicetify.Platform.ClipboardAPI as ClipboardAPI).copy(text);
}

function checkUriLength(uris: string[]): boolean {
    if (uris.length === 0) {
        Spicetify.showNotification(i18next.t('noElements'), true);
        return false;
    }

    return true;
}

function shouldAdd(uris: string[]): boolean {
    return uris
        .map((u) => Spicetify.URI.fromString(u))
        .some((u) => !supportedTypes.includes(u.type))
        ? false
        : true;
}

async function main() {
    while (!Spicetify?.Platform) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await i18next.init({
        lng: locale.getLocale(),
        fallbackLng: 'en',
        debug: false,
        resources: {
            en: {
                translation: {
                    copy: 'Copy',
                    name: 'Name',
                    data: 'Data',
                    noElements: 'No element selected.',
                    copied: 'Copied to clipboard',
                },
            },
            fr: {
                translation: {
                    copy: 'Copier',
                    name: 'Nom',
                    data: 'Données',
                    noElements: 'Aucun élément sélectionné.',
                    copied: 'Copié dans le presse-papier',
                },
            },
        },
    });

    new Spicetify.ContextMenu.SubMenu(
        i18next.t('copy'),
        [
            new Spicetify.ContextMenu.Item(
                i18next.t('name'),
                async (uris) => {
                    if (!checkUriLength(uris)) {
                        return;
                    }

                    const names: string[] = [];

                    for (let uri of uris) {
                        const name = await getName(uri);
                        if (name === null) {
                            Spicetify.showNotification(
                                `Couldn't get name for URI '${uri}'`,
                                true
                            );
                            return;
                        } else {
                            names.push(name);
                        }
                    }

                    copy(names.join(locale.getSeparator()));
                },
                () => true
            ),
            new Spicetify.ContextMenu.Item(
                'ID',
                (uris) => {
                    if (!checkUriLength(uris)) {
                        return;
                    }

                    const ids = uris.map((uri) =>
                        getId(Spicetify.URI.fromString(uri))
                    );
                    copy(ids.join(locale.getSeparator()));
                },
                () => true
            ),
            new Spicetify.ContextMenu.Item(
                'URI',
                (uris) => {
                    if (!checkUriLength(uris)) {
                        return;
                    }

                    copy(uris.join(locale.getSeparator()));
                },
                () => true
            ),
            new Spicetify.ContextMenu.Item(
                i18next.t('data'),
                async (uris) => {
                    if (!checkUriLength(uris)) {
                        return;
                    }

                    const result: any[] = [];

                    for (let uri of uris) {
                        const data = await getData(uri);
                        if (data === null) {
                            Spicetify.showNotification(
                                `Couldn't get data for URI '${uri}'`,
                                true
                            );
                            return;
                        } else {
                            result.push(data);
                        }
                    }

                    copy(result);
                },
                () => true
            ),
        ],
        (uris) => shouldAdd(uris)
    ).register();
}

export default main;
