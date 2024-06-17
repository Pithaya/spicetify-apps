import React from 'react';
import type { ClipboardAPI } from '@shared/platform/clipboard';
import {
    waitForSpicetify,
    waitForPlatformApi,
} from '@shared/utils/spicetify-utils';
import { getId } from '@shared/utils/uri-utils';
import i18next from 'i18next';
import { Clipboard } from 'lucide-react';
import { getTrack } from '@spotify-web-api/api/api.tracks';
import { getAlbum } from '@spotify-web-api/api/api.albums';
import { getArtist } from '@spotify-web-api/api/api.artists';
import { getEpisode } from '@spotify-web-api/api/api.episodes';
import { getShow } from '@spotify-web-api/api/api.shows';
import { getPlaylist } from '@spotify-web-api/api/api.playlists';
import type { Track } from '@spotify-web-api/models/track';
import type { Album } from '@spotify-web-api/models/album';
import type { Artist } from '@spotify-web-api/models/artist';
import type { Show } from '@spotify-web-api/models/show';
import type { Episode } from '@spotify-web-api/models/episode';
import type { Playlist } from '@spotify-web-api/models/playlist';

let locale: typeof Spicetify.Locale;
let clipboardApi: ClipboardAPI;

async function getData(
    uriString: string,
): Promise<Track | Album | Artist | Playlist | Show | Episode | null> {
    const uri: Spicetify.URI = Spicetify.URI.fromString(uriString);
    const id = getId(uri);

    if (id === null) {
        return null;
    }

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

async function getName(uri: string): Promise<string | null> {
    const data = await getData(uri);

    if (data === null) {
        return null;
    }

    return data.name;
}

async function copy(text: string | any): Promise<void> {
    Spicetify.showNotification(i18next.t('copied'));
    await clipboardApi.copy(text);
}

async function main(): Promise<void> {
    await waitForSpicetify();
    clipboardApi = await waitForPlatformApi<ClipboardAPI>('ClipboardAPI');
    locale = Spicetify.Locale;

    await i18next.init({
        lng: locale.getLocale(),
        fallbackLng: 'en',
        debug: false,
        resources: {
            en: {
                translation: {
                    copyTrack: 'Copy track',
                    copyAlbum: 'Copy album',
                    copyArtist: 'Copy artist',
                    copyPlaylist: 'Copy playlist',
                    copyShow: 'Copy show',
                    copyEpisode: 'Copy episode',
                    name: 'Name',
                    data: 'Data',
                    noElements: 'No element selected.',
                    copied: 'Copied to clipboard',
                },
            },
            fr: {
                translation: {
                    copyTrack: 'Copier la piste',
                    copyAlbum: "Copier l'album",
                    copyArtist: "Copier l'artiste",
                    copyPlaylist: 'Copier la playlist',
                    copyShow: 'Copier le podcast',
                    copyEpisode: "Copier l'épisode",
                    name: 'Nom',
                    data: 'Données',
                    noElements: 'Aucun élément sélectionné.',
                    copied: 'Copié dans le presse-papier',
                },
            },
        },
    });

    const copyNameItem = new Spicetify.ContextMenu.Item(
        i18next.t('name'),
        async (uris) => {
            const names: string[] = [];

            for (const uri of uris) {
                const name = await getName(uri);
                if (name === null) {
                    Spicetify.showNotification(
                        `Couldn't get name for URI '${uri}'`,
                        true,
                    );
                    return;
                } else {
                    names.push(name);
                }
            }

            await copy(names.join(locale.getSeparator()));
        },
        () => true,
    );

    const copyIdItem = new Spicetify.ContextMenu.Item(
        'ID',
        async (uris) => {
            const ids = uris.map((uri) => getId(Spicetify.URI.fromString(uri)));
            await copy(ids.join(locale.getSeparator()));
        },
        () => true,
    );

    const copyUriItem = new Spicetify.ContextMenu.Item(
        'URI',
        async (uris) => {
            await copy(uris.join(locale.getSeparator()));
        },
        () => true,
    );

    const copyDataItem = new Spicetify.ContextMenu.Item(
        i18next.t('data'),
        async (uris) => {
            const result: any[] = [];

            for (const uri of uris) {
                const data = await getData(uri);
                if (data === null) {
                    Spicetify.showNotification(
                        `Couldn't get data for URI '${uri}'`,
                        true,
                    );
                    return;
                } else {
                    result.push(data);
                }
            }

            await copy(result);
        },
        () => true,
    );

    const icon = Spicetify.ReactDOMServer.renderToString(
        <Clipboard size={16} color="var(--text-subdued)" strokeWidth={1} />,
    );

    const createSubmenu = (
        labelKey: string,
        shouldAdd: Spicetify.ContextMenu.ShouldAddCallback,
    ): void => {
        new Spicetify.ContextMenu.SubMenu(
            i18next.t(labelKey),
            [copyNameItem, copyIdItem, copyUriItem, copyDataItem],
            shouldAdd,
            false,
            icon,
        ).register();
    };

    // TODO : If multiple rows tracks are selected, add menus to copy album, artist

    createSubmenu(
        'copyTrack',
        (uris) => uris.length === 1 && Spicetify.URI.isTrack(uris[0]),
    );
    createSubmenu(
        'copyAlbum',
        (uris) => uris.length === 1 && Spicetify.URI.isAlbum(uris[0]),
    );
    createSubmenu(
        'copyArtist',
        (uris) => uris.length === 1 && Spicetify.URI.isArtist(uris[0]),
    );
    createSubmenu(
        'copyPlaylist',
        (uris) => uris.length === 1 && Spicetify.URI.isPlaylistV1OrV2(uris[0]),
    );
    createSubmenu(
        'copyShow',
        (uris) => uris.length === 1 && Spicetify.URI.isShow(uris[0]),
    );
    createSubmenu(
        'copyEpisode',
        (uris) => uris.length === 1 && Spicetify.URI.isEpisode(uris[0]),
    );
}

export default main;
