import type { AuthorizationAPI } from '@shared/platform/authorization';
import { waitForPlatformApi } from './spicetify-utils';
import { getId } from './uri-utils';
import type {
    Album,
    Artist,
    Episode,
    MaxInt,
    Page,
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

    const sdk = getCosmosSdkClient();

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

/**
 * Get a Spotify API client that uses the default fetch implementation.
 * @returns The client.
 */
export function getSdkClient(): SpotifyApi {
    return new SpotifyApi({
        errorHandler: new ConsoleLoggingErrorHandler(),
        authentication: {
            getAccessToken: async () => {
                const authorizationApi =
                    await waitForPlatformApi<AuthorizationAPI>(
                        'AuthorizationAPI',
                    );

                return authorizationApi.getState().token.accessToken;
            },
        },
    });
}

type CosmosProxyErrorResponse = {
    /**
     * Response status
     */
    code: number;
    /**
     * Response status text
     */
    error: string;
    message: 'Failed to fetch';
    stack: undefined;
};

/**
 * Get a Spotify API client that uses the Cosmos proxy.
 * @returns The client.
 */
export function getCosmosSdkClient(): SpotifyApi {
    return new SpotifyApi({
        errorHandler: new ConsoleLoggingErrorHandler(),
        fetch: async (url, init) => {
            // TODO: handle other methods
            if (init.method !== 'GET') {
                throw new Error('Only GET requests are supported');
            }

            return await Spicetify.CosmosAsync.get(url);
        },
        responseValidator: {
            validateResponse: async (response: any) => {
                if (response.message === 'Failed to fetch') {
                    const { code, error } =
                        response as CosmosProxyErrorResponse;
                    throw new Error(`Failed to fetch: ${code} - ${error}`);
                }
            },
        },
        deserializer: {
            deserialize: async (response: any) => {
                return response;
            },
        },
    });
}

/**
 * Get items from all pages.
 * @param getPage Callback to get data for a page.
 * @param initialOffset Initial offset.
 * @param maxItemsCount Maximum number of items to get. If not provided, all items will be fetched.
 * @returns A list of items.
 */
export async function getAllPages<T>(
    getPage: (offset: number, limit: MaxInt<50>) => Promise<Page<T> | null>,
    initialOffset: number,
    maxItemsCount?: number,
): Promise<T[]> {
    const items: T[] = [];
    let currentPage: Page<T> | null = null;
    let offset = initialOffset;
    // If the total to get is less than 50, we can get all in a single query
    // else, get the maximum of items per page
    let limit: MaxInt<50> =
        maxItemsCount !== undefined && maxItemsCount <= 50
            ? (maxItemsCount as MaxInt<50>)
            : 50;

    do {
        currentPage = await getPage(offset, limit);

        if (currentPage === null) {
            break;
        }

        if (maxItemsCount === undefined) {
            maxItemsCount = currentPage.total;
        }

        items.push(...currentPage.items);

        offset += limit;
        limit = Math.min(...[50, maxItemsCount - items.length]) as MaxInt<50>;
    } while (currentPage?.next !== null && items.length < maxItemsCount);

    return items;
}
