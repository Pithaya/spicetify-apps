import type { AuthorizationAPI } from '@shared/platform/authorization';
import { waitForPlatformApi } from './spicetify-utils';
import { getId } from './uri-utils';
import type {
    Album,
    Artist,
    Episode,
    IAuthStrategy,
    Playlist,
    Show,
    Track,
} from '@spotify-web-api';
import {
    SpotifyApi,
    MAX_GET_MULTIPLE_ALBUMS_IDS,
    MAX_GET_MULTIPLE_ARTISTS_IDS,
    MAX_GET_MULTIPLE_EPISODES_IDS,
    MAX_GET_MULTIPLE_SHOWS_IDS,
    MAX_GET_MULTIPLE_TRACKS_IDS,
    ConsoleLoggingErrorHandler,
} from '@spotify-web-api';

/**
 * Get Spotify catalog information for multiple tracks, albums, artists, playlists, shows, or episodes identified by their Spotify URI.
 * All of the provided URIs must be of the same type.
 * @param uriStrings The Spotify URIs.
 * @returns The requested data.
 */
export async function getApiData(
    uriStrings: string[],
): Promise<
    | (Track | null)[]
    | (Album | null)[]
    | (Artist | null)[]
    | (Playlist | null)[]
    | (Show | null)[]
    | (Episode | null)[]
> {
    if (uriStrings.length === 0) {
        return [];
    }

    const uris: Spicetify.URI[] = uriStrings.map((uri) =>
        Spicetify.URI.fromString(uri),
    );
    const ids: (string | null)[] = uris.map((uri) => getId(uri));

    if (ids.some((id) => id === null)) {
        return [];
    }

    const sdk = getSdkClient();

    if (uris.every((uri) => Spicetify.URI.isTrack(uri))) {
        return await getDataForIds(
            ids as string[],
            MAX_GET_MULTIPLE_TRACKS_IDS,
            async (id) => await sdk.tracks.get(id),
            async (ids) => await sdk.tracks.get(ids),
        );
    }

    if (uris.every((uri) => Spicetify.URI.isAlbum(uri))) {
        return await getDataForIds(
            ids as string[],
            MAX_GET_MULTIPLE_ALBUMS_IDS,
            async (id) => await sdk.albums.get(id),
            async (ids) => await sdk.albums.get(ids),
        );
    }

    if (uris.every((uri) => Spicetify.URI.isArtist(uri))) {
        return await getDataForIds(
            ids as string[],
            MAX_GET_MULTIPLE_ARTISTS_IDS,
            async (id) => await sdk.artists.get(id),
            async (ids) => await sdk.artists.get(ids),
        );
    }

    if (uris.every((uri) => Spicetify.URI.isPlaylistV1OrV2(uri))) {
        if (ids.length > 1) {
            Spicetify.showNotification(
                `Cannot get more than 1 playlist at once`,
                true,
            );

            return [];
        }

        return [await sdk.playlists.getPlaylist(ids[0]!)];
    }

    if (uris.every((uri) => Spicetify.URI.isShow(uri))) {
        return await getDataForIds(
            ids as string[],
            MAX_GET_MULTIPLE_SHOWS_IDS,
            async (id) => await sdk.shows.get(id),
            async (ids) => await sdk.shows.get(ids),
        );
    }

    if (uris.every((uri) => Spicetify.URI.isEpisode(uri))) {
        return await getDataForIds(
            ids as string[],
            MAX_GET_MULTIPLE_EPISODES_IDS,
            async (id) => await sdk.episodes.get(id),
            async (ids) => await sdk.episodes.get(ids),
        );
    }

    return [];
}

async function getDataForIds<T>(
    ids: string[],
    maxIds: number,
    getSingle: (id: string) => Promise<T | null>,
    getMultiple: (ids: string[]) => Promise<T[]>,
): Promise<(T | null)[]> {
    if (ids.length > maxIds) {
        Spicetify.showNotification(
            `Cannot get more than ${maxIds} tracks at once`,
            true,
        );

        return [];
    }

    return ids.length === 1
        ? [await getSingle(ids[0])]
        : await getMultiple(ids);
}

export function getSdkClient(): SpotifyApi {
    const authStrategy: IAuthStrategy = {
        getAccessToken: async () => {
            const authorizationApi =
                await waitForPlatformApi<AuthorizationAPI>('AuthorizationAPI');

            return authorizationApi.getState().token.accessToken;
        },
    };

    return new SpotifyApi(authStrategy, {
        errorHandler: new ConsoleLoggingErrorHandler(),
    });
}
