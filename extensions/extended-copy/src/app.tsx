import type { Album } from '@shared/api/models/album';
import type { Artist } from '@shared/api/models/artist';
import type { Episode } from '@shared/api/models/episode';
import type { Playlist } from '@shared/api/models/playlist';
import type { Show } from '@shared/api/models/show';
import type { Track } from '@shared/api/models/track';
import type { ClipboardAPI } from '@shared/platform/clipboard';
import { getPlatform, waitForSpicetify } from '@shared/utils/spicetify-utils';
import { getId } from '@shared/utils/uri-utils';
import { getApiData } from '@shared/utils/web-api-utils';
import i18next from 'i18next';
import { Clipboard } from 'lucide-react';
import React from 'react';

let locale: typeof Spicetify.Locale;
let clipboardApi: ClipboardAPI;

type DataItem = Track | Album | Artist | Playlist | Show | Episode;
type DataItemWithArtists = Track | Album;

const hasArtists = (item: DataItem): item is DataItemWithArtists => {
    return item.type === 'track' || item.type === 'album';
};

async function getData(uris: string[]): Promise<DataItem[]> {
    const data = await getApiData(uris);

    const items: DataItem[] = [];
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

async function copy(text: string | object): Promise<void> {
    Spicetify.showNotification(i18next.t('copied'));
    await clipboardApi.copy(text);
}

async function main(): Promise<void> {
    await waitForSpicetify();

    clipboardApi = getPlatform().ClipboardAPI;
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
                    artist: 'Artist',
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
                    artist: 'Artiste',
                    noElements: 'Aucun élément sélectionné.',
                    copied: 'Copié dans le presse-papier',
                },
            },
        },
    });

    const copyNameItem = new Spicetify.ContextMenu.Item(
        i18next.t('name'),
        async (uris) => {
            const data = await getData(uris);
            const names = data.map((item) => item.name);
            await copy(names.join(locale.getSeparator()));
        },
        () => true,
    );

    const copyArtistItem = new Spicetify.ContextMenu.Item(
        i18next.t('artist'),
        async (uris) => {
            const results = await getData(uris);
            const artistNames = results
                .filter(hasArtists)
                .map((item) =>
                    item.artists
                        .map((artist) => artist.name)
                        .join(locale.getSeparator()),
                );
            await copy(artistNames.join(locale.getSeparator()));
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
            const data = await getData(uris);
            await copy(data);
        },
        () => true,
    );

    const icon = Spicetify.ReactDOMServer.renderToString(
        <Clipboard size={16} color="var(--text-subdued)" strokeWidth={1} />,
    );

    const createSubmenu = (
        labelKey: string,
        shouldAdd: Spicetify.ContextMenu.ShouldAddCallback,
        subItems: Spicetify.ContextMenu.Item[],
    ): void => {
        new Spicetify.ContextMenu.SubMenu(
            i18next.t(labelKey),
            subItems,
            shouldAdd,
            false,
            icon,
        ).register();
    };

    createSubmenu(
        'copyTrack',
        (uris) => uris.length === 1 && Spicetify.URI.isTrack(uris[0]),
        [copyNameItem, copyArtistItem, copyIdItem, copyUriItem, copyDataItem],
    );
    createSubmenu(
        'copyTracks',
        (uris) =>
            uris.length > 1 && uris.every((uri) => Spicetify.URI.isTrack(uri)),
        [copyNameItem, copyArtistItem, copyIdItem, copyUriItem, copyDataItem],
    );
    createSubmenu(
        'copyAlbum',
        (uris) => uris.length === 1 && Spicetify.URI.isAlbum(uris[0]),
        [copyNameItem, copyArtistItem, copyIdItem, copyUriItem, copyDataItem],
    );
    createSubmenu(
        'copyArtist',
        (uris) => uris.length === 1 && Spicetify.URI.isArtist(uris[0]),
        [copyNameItem, copyIdItem, copyUriItem, copyDataItem],
    );
    createSubmenu(
        'copyPlaylist',
        (uris) => uris.length === 1 && Spicetify.URI.isPlaylistV1OrV2(uris[0]),
        [copyNameItem, copyIdItem, copyUriItem, copyDataItem],
    );
    createSubmenu(
        'copyShow',
        (uris) => uris.length === 1 && Spicetify.URI.isShow(uris[0]),
        [copyNameItem, copyIdItem, copyUriItem, copyDataItem],
    );
    createSubmenu(
        'copyEpisode',
        (uris) => uris.length === 1 && Spicetify.URI.isEpisode(uris[0]),
        [copyNameItem, copyIdItem, copyUriItem, copyDataItem],
    );
}

export default main;
