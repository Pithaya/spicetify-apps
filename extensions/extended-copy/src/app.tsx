import type { AlbumNameAndTracksData } from '@shared/graphQL/models/album-name-and-tracks-data';
import type { ArtistMinimalData } from '@shared/graphQL/models/artist-minimal-data';
import type { EpisodeNameData } from '@shared/graphQL/models/episode-name-data';
import type { TrackNameData } from '@shared/graphQL/models/track-name-data';
import {
    getAlbumNameAndTracks,
    getEpisodeName,
    getTrackName,
    queryArtistMinimal,
} from '@shared/graphQL/graphQL-client';
import type { Playlist, PlaylistAPI } from '@shared/platform/playlist';
import type { ShowAPI, ShowMetadata } from '@shared/platform/show';
import type { ClipboardAPI } from '@shared/platform/clipboard';
import {
    waitForSpicetify,
    waitForPlatformApi,
} from '@shared/utils/spicetify-utils';
import { getId } from '@shared/utils/uri-utils';
import i18next from 'i18next';

let locale: typeof Spicetify.Locale;
let supportedTypes: string[] = [];
let showApi: ShowAPI;
let playlistApi: PlaylistAPI;
let clipboardApi: ClipboardAPI;

async function getData(
    uriString: string,
): Promise<
    | TrackNameData
    | AlbumNameAndTracksData
    | ArtistMinimalData
    | Playlist
    | ShowMetadata
    | EpisodeNameData
    | null
> {
    const uri: Spicetify.URI = Spicetify.URI.fromString(uriString);
    const id = getId(uri);

    if (id === null) {
        return null;
    }

    if (Spicetify.URI.isTrack(uri)) {
        return await getTrackName(uri);
    }

    if (Spicetify.URI.isAlbum(uri)) {
        return await getAlbumNameAndTracks(uri, 0, 0);
    }

    if (Spicetify.URI.isArtist(uri)) {
        return await queryArtistMinimal(uri);
    }

    if (Spicetify.URI.isPlaylistV1OrV2(uri)) {
        return await playlistApi.getPlaylist(
            uriString,
            {},
            { filter: '', limit: 0, offset: 0, sort: undefined },
        );
    }

    if (Spicetify.URI.isShow(uri)) {
        return await showApi.getMetadata(uriString);
    }

    if (Spicetify.URI.isEpisode(uri)) {
        return await getEpisodeName(uri);
    }

    return null;
}

async function getName(uriString: string): Promise<string | null> {
    const uri: Spicetify.URI = Spicetify.URI.fromString(uriString);
    const id = getId(uri);

    if (id === null) {
        return null;
    }

    if (Spicetify.URI.isTrack(uri)) {
        return (await getTrackName(uri)).trackUnion.name;
    }

    if (Spicetify.URI.isAlbum(uri)) {
        return (await getAlbumNameAndTracks(uri, 0, 0)).albumUnion.name;
    }

    if (Spicetify.URI.isArtist(uri)) {
        return (await queryArtistMinimal(uri)).artistUnion.profile.name;
    }

    if (Spicetify.URI.isPlaylistV1OrV2(uri)) {
        return (
            await playlistApi.getPlaylist(
                uriString,
                {},
                { filter: '', limit: 0, offset: 0, sort: undefined },
            )
        ).metadata.name;
    }

    if (Spicetify.URI.isShow(uri)) {
        return (await showApi.getMetadata(uriString)).name;
    }

    if (Spicetify.URI.isEpisode(uri)) {
        return (await getEpisodeName(uri)).episodeUnionV2.name;
    }

    return null;
}

async function copy(text: string | any): Promise<void> {
    Spicetify.showNotification(i18next.t('copied'));
    await clipboardApi.copy(text);
}

function checkUriLength(uris: string[]): boolean {
    if (uris.length === 0) {
        Spicetify.showNotification(i18next.t('noElements'), true);
        return false;
    }

    return true;
}

function shouldAdd(uris: string[]): boolean {
    return !uris
        .map((u) => Spicetify.URI.fromString(u))
        .some((u) => !supportedTypes.includes(u.type));
}

async function main(): Promise<void> {
    await waitForSpicetify();

    showApi = await waitForPlatformApi<ShowAPI>('ShowAPI');
    playlistApi = await waitForPlatformApi<PlaylistAPI>('PlaylistAPI');
    clipboardApi = await waitForPlatformApi<ClipboardAPI>('ClipboardAPI');

    locale = Spicetify.Locale;
    supportedTypes = [
        Spicetify.URI.Type.TRACK,
        Spicetify.URI.Type.ALBUM,
        Spicetify.URI.Type.ARTIST,
        Spicetify.URI.Type.PLAYLIST,
        Spicetify.URI.Type.PLAYLIST_V2,
        Spicetify.URI.Type.SHOW,
        Spicetify.URI.Type.EPISODE,
    ];

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
            ),
            new Spicetify.ContextMenu.Item(
                'ID',
                async (uris) => {
                    if (!checkUriLength(uris)) {
                        return;
                    }

                    const ids = uris.map((uri) =>
                        getId(Spicetify.URI.fromString(uri)),
                    );
                    await copy(ids.join(locale.getSeparator()));
                },
                () => true,
            ),
            new Spicetify.ContextMenu.Item(
                'URI',
                async (uris) => {
                    if (!checkUriLength(uris)) {
                        return;
                    }

                    await copy(uris.join(locale.getSeparator()));
                },
                () => true,
            ),
            new Spicetify.ContextMenu.Item(
                i18next.t('data'),
                async (uris) => {
                    if (!checkUriLength(uris)) {
                        return;
                    }

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
            ),
        ],
        (uris) => shouldAdd(uris),
    ).register();
}

export default main;
