import React from 'react';
import type { ClipboardAPI } from '@shared/platform/clipboard';
import {
    waitForSpicetify,
    waitForPlatformApi,
} from '@shared/utils/spicetify-utils';
import { getId } from '@shared/utils/uri-utils';
import i18next from 'i18next';
import { Clipboard } from 'lucide-react';
import { getApiData } from '@shared/utils/web-api-utils';
import type { Track } from '@spotify-web-api/models/track';
import type { Album } from '@spotify-web-api/models/album';
import type { Artist } from '@spotify-web-api/models/artist';
import type { Show } from '@spotify-web-api/models/show';
import type { Episode } from '@spotify-web-api/models/episode';
import type { Playlist } from '@spotify-web-api/models/playlist';

let locale: typeof Spicetify.Locale;
let clipboardApi: ClipboardAPI;

async function getNames(uris: string[]): Promise<string[]> {
    const data = await getApiData(uris);

    const names: string[] = [];
    const invalidUris: string[] = [];

    for (const [index, item] of data.entries()) {
        if (item === null) {
            invalidUris.push(uris[index]);
        } else {
            names.push(item.name);
        }
    }

    if (invalidUris.length > 0) {
        Spicetify.showNotification(
            `Couldn't get data for URIs: ${invalidUris.join(', ')}`,
            true,
        );
    }

    return names;
}

async function getData(
    uris: string[],
): Promise<(Track | Album | Artist | Playlist | Show | Episode)[]> {
    const data = await getApiData(uris);

    const items: (Track | Album | Artist | Playlist | Show | Episode)[] = [];
    const invalidUris: string[] = [];

    for (const [index, item] of data.entries()) {
        if (item === null) {
            invalidUris.push(uris[index]);
        } else {
            items.push(item);
        }
    }

    if (invalidUris.length > 0) {
        Spicetify.showNotification(
            `Couldn't get data for URIs: ${invalidUris.join(', ')}`,
            true,
        );
    }

    return items;
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
                    copyTracks: 'Copy tracks',
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
                    copyTracks: 'Copier les pistes',
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
            const names: string[] = await getNames(uris);
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
            const results = await getData(uris);
            await copy(results);
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

    createSubmenu(
        'copyTrack',
        (uris) => uris.length === 1 && Spicetify.URI.isTrack(uris[0]),
    );
    createSubmenu(
        'copyTracks',
        (uris) =>
            uris.length > 1 && uris.every((uri) => Spicetify.URI.isTrack(uri)),
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
