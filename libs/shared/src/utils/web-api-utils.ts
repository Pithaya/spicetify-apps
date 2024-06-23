import {
    MAX_GET_MULTIPLE_TRACKS_IDS,
    getTrack,
    getTracks,
} from '@spotify-web-api/api/api.tracks';
import {
    MAX_GET_MULTIPLE_ALBUMS_IDS,
    getAlbum,
    getAlbums,
} from '@spotify-web-api/api/api.albums';
import {
    MAX_GET_MULTIPLE_ARTISTS_IDS,
    getArtist,
    getArtists,
} from '@spotify-web-api/api/api.artists';
import {
    MAX_GET_MULTIPLE_EPISODES_IDS,
    getEpisode,
    getEpisodes,
} from '@spotify-web-api/api/api.episodes';
import {
    MAX_GET_MULTIPLE_SHOWS_IDS,
    getShow,
    getShows,
} from '@spotify-web-api/api/api.shows';
import { getPlaylist } from '@spotify-web-api/api/api.playlists';
import type { Track } from '@spotify-web-api/models/track';
import type { Album } from '@spotify-web-api/models/album';
import type { Artist } from '@spotify-web-api/models/artist';
import type { Show } from '@spotify-web-api/models/show';
import type { Episode } from '@spotify-web-api/models/episode';
import type { Playlist } from '@spotify-web-api/models/playlist';
import { getId } from './uri-utils';

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

    if (uris.every((uri) => Spicetify.URI.isTrack(uri))) {
        return await getDataForIds(
            ids as string[],
            MAX_GET_MULTIPLE_TRACKS_IDS,
            getTrack,
            getTracks,
        );
    }

    if (uris.every((uri) => Spicetify.URI.isAlbum(uri))) {
        return await getDataForIds(
            ids as string[],
            MAX_GET_MULTIPLE_ALBUMS_IDS,
            getAlbum,
            getAlbums,
        );
    }

    if (uris.every((uri) => Spicetify.URI.isArtist(uri))) {
        return await getDataForIds(
            ids as string[],
            MAX_GET_MULTIPLE_ARTISTS_IDS,
            getArtist,
            getArtists,
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

        return [await getPlaylist(ids[0]!)];
    }

    if (uris.every((uri) => Spicetify.URI.isShow(uri))) {
        return await getDataForIds(
            ids as string[],
            MAX_GET_MULTIPLE_SHOWS_IDS,
            getShow,
            getShows,
        );
    }

    if (uris.every((uri) => Spicetify.URI.isEpisode(uri))) {
        return await getDataForIds(
            ids as string[],
            MAX_GET_MULTIPLE_EPISODES_IDS,
            getEpisode,
            getEpisodes,
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
