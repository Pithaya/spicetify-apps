import {
    ClipboardAPI,
    Locale,
    Platform,
    Playlist,
    ShowMetadata,
} from '@shared/platform';
import { getId } from '@shared/utils';
import {
    AlbumNameAndTracksData,
    ArtistMinimalData,
    EpisodeNameData,
    GraphQLClient,
    TrackNameData,
} from '@shared/graphQL';
import i18next from 'i18next';

let locale: Locale;
let supportedTypes: string[] = [];

async function getData(
    uriString: string
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
        return await GraphQLClient.getTrackName(uri);
    }

    if (Spicetify.URI.isAlbum(uri)) {
        return await GraphQLClient.getAlbumNameAndTracks(uri, 0, 0);
    }

    if (Spicetify.URI.isArtist(uri)) {
        return await GraphQLClient.queryArtistMinimal(uri);
    }

    if (Spicetify.URI.isPlaylistV1OrV2(uri)) {
        return await Platform.PlaylistAPI.getPlaylist(
            uriString,
            {},
            { filter: '', limit: 0, offset: 0, sort: undefined }
        );
    }

    if (Spicetify.URI.isShow(uri)) {
        return await Platform.ShowAPI.getMetadata(uriString);
    }

    if (Spicetify.URI.isEpisode(uri)) {
        return await GraphQLClient.getEpisodeName(uri);
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
        return (await GraphQLClient.getTrackName(uri)).trackUnion.name;
    }

    if (Spicetify.URI.isAlbum(uri)) {
        return (await GraphQLClient.getAlbumNameAndTracks(uri, 0, 0)).albumUnion
            .name;
    }

    if (Spicetify.URI.isArtist(uri)) {
        return (await GraphQLClient.queryArtistMinimal(uri)).artistUnion.profile
            .name;
    }

    if (Spicetify.URI.isPlaylistV1OrV2(uri)) {
        return (
            await Platform.PlaylistAPI.getPlaylist(
                uriString,
                {},
                { filter: '', limit: 0, offset: 0, sort: undefined }
            )
        ).metadata.name;
    }

    if (Spicetify.URI.isShow(uri)) {
        return (await Platform.ShowAPI.getMetadata(uriString)).name;
    }

    if (Spicetify.URI.isEpisode(uri)) {
        return (await GraphQLClient.getEpisodeName(uri)).episodeUnionV2.name;
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

    locale = (Spicetify as any).Locale;
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
