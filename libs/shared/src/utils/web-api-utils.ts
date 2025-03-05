import { getAlbum } from '@shared/api/endpoints/albums/get-album';
import {
    getAlbums,
    MAX_GET_MULTIPLE_ALBUMS_IDS,
} from '@shared/api/endpoints/albums/get-albums';
import { getArtist } from '@shared/api/endpoints/artists/get-artist';
import {
    getArtists,
    MAX_GET_MULTIPLE_ARTISTS_IDS,
} from '@shared/api/endpoints/artists/get-artists';
import { getEpisode } from '@shared/api/endpoints/episodes/get-episode';
import {
    getEpisodes,
    MAX_GET_MULTIPLE_EPISODES_IDS,
} from '@shared/api/endpoints/episodes/get-episodes';
import { getPlaylist } from '@shared/api/endpoints/playlists/get-playlist';
import { getShow } from '@shared/api/endpoints/shows/get-show';
import {
    getShows,
    MAX_GET_MULTIPLE_SHOWS_IDS,
} from '@shared/api/endpoints/shows/get-shows';
import { getTrack } from '@shared/api/endpoints/tracks/get-track';
import {
    getTracks,
    MAX_GET_MULTIPLE_TRACKS_IDS,
} from '@shared/api/endpoints/tracks/get-tracks';
import type { Album } from '@shared/api/models/album';
import type { Artist } from '@shared/api/models/artist';
import type { Episode } from '@shared/api/models/episode';
import type { Page } from '@shared/api/models/page';
import type { Playlist } from '@shared/api/models/playlist';
import type { Show } from '@shared/api/models/show';
import type { Track } from '@shared/api/models/track';
import { isNotEmpty } from './array-utils';

/**
 * Get Spotify catalog information for multiple tracks, albums, artists, playlists, shows, or episodes identified by their Spotify URI.
 * All of the provided URIs must be of the same type.
 * @param uriStrings The Spotify URIs.
 * @returns The requested data.
 */
export async function getApiData(
    uris: string[],
): Promise<
    | (Track | null)[]
    | (Album | null)[]
    | (Artist | null)[]
    | (Playlist | null)[]
    | (Show | null)[]
    | (Episode | null)[]
> {
    if (!isNotEmpty(uris)) {
        return [];
    }

    if (uris.every((uri) => Spicetify.URI.isTrack(uri))) {
        return await getDataForIds(
            uris,
            MAX_GET_MULTIPLE_TRACKS_IDS,
            async (uri) => await getTrack({ uri }),
            async (uris) => await getTracks({ uris }),
        );
    }

    if (uris.every((uri) => Spicetify.URI.isAlbum(uri))) {
        return await getDataForIds(
            uris,
            MAX_GET_MULTIPLE_ALBUMS_IDS,
            async (uri) => await getAlbum({ uri }),
            async (uris) => await getAlbums({ uris }),
        );
    }

    if (uris.every((uri) => Spicetify.URI.isArtist(uri))) {
        return await getDataForIds(
            uris,
            MAX_GET_MULTIPLE_ARTISTS_IDS,
            async (uri) => await getArtist({ uri }),
            async (uris) => await getArtists({ uris }),
        );
    }

    if (uris.every((uri) => Spicetify.URI.isPlaylistV1OrV2(uri))) {
        if (uris.length > 1) {
            Spicetify.showNotification(
                `Cannot get more than 1 playlist at once`,
                true,
            );

            return [];
        }

        return [await getPlaylist({ uri: uris[0] })];
    }

    if (uris.every((uri) => Spicetify.URI.isShow(uri))) {
        return await getDataForIds(
            uris,
            MAX_GET_MULTIPLE_SHOWS_IDS,
            async (uri) => await getShow({ uri }),
            async (uris) => await getShows({ uris }),
        );
    }

    if (uris.every((uri) => Spicetify.URI.isEpisode(uri))) {
        return await getDataForIds(
            uris,
            MAX_GET_MULTIPLE_EPISODES_IDS,
            async (uri) => await getEpisode({ uri }),
            async (uris) => await getEpisodes({ uris }),
        );
    }

    return [];
}

async function getDataForIds<T>(
    uris: [string, ...string[]],
    maxUris: number,
    getSingle: (id: string) => Promise<T | null>,
    getMultiple: (ids: [string, ...string[]]) => Promise<T[]>,
): Promise<(T | null)[]> {
    if (uris.length > maxUris) {
        Spicetify.showNotification(
            `Cannot get more than ${maxUris.toFixed()} tracks at once`,
            true,
        );

        return [];
    }

    return uris.length === 1
        ? [await getSingle(uris[0])]
        : await getMultiple(uris);
}

/**
 * Get items from all pages.
 * @param getPage Callback to get data for a page.
 * @param initialOffset Initial offset.
 * @param maxItemsCount Maximum number of items to get. If not provided, all items will be fetched.
 * @returns A list of items.
 */
export async function getAllPages<T>(
    getPage: (offset: number, limit: number) => Promise<Page<T> | null>,
    initialOffset: number,
    maxLimit: number,
    maxItemsCount?: number,
): Promise<T[]> {
    const items: T[] = [];
    let currentPage: Page<T> | null = null;
    let offset = initialOffset;
    // If the total to get is less than the max limit, we can get all in a single query
    // else, get the maximum of items per page
    let limit: number =
        maxItemsCount !== undefined && maxItemsCount <= maxLimit
            ? maxItemsCount
            : maxLimit;

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
        limit = Math.min(...[maxLimit, maxItemsCount - items.length]);
    } while (currentPage.next !== null && items.length < maxItemsCount);

    return items;
}
