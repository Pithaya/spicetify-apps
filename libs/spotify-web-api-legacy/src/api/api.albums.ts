import { ArgumentError } from '@spotify-web-api-legacy/models/errors';
import { handleError } from '../helpers';
import type { Album } from '../models/album';
import { get } from '../utils/fetch-utils';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';

const baseUrl = `${spotifyWebApiBaseUrl}/albums`;

export const MAX_GET_MULTIPLE_ALBUMS_IDS = 20;

/**
 * Get Spotify catalog information for a single album.
 * @param id The Spotify ID of the album.
 * @returns An album
 */
export async function getAlbum(id: string): Promise<Album | null> {
    try {
        return await get(`${baseUrl}/${id}`);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}

/**
 * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
 * @param ids A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs.
 * @returns A set of albums
 */
export async function getAlbums(ids: string[]): Promise<Album[]> {
    try {
        if (ids.length > MAX_GET_MULTIPLE_ALBUMS_IDS) {
            throw new ArgumentError(
                `The maximum number of IDs is ${MAX_GET_MULTIPLE_ALBUMS_IDS}.`,
            );
        }

        const result = await get<{ albums: Album[] }>(
            `${baseUrl}?ids=${ids.join(',')}`,
        );
        return result.albums;
    } catch (error: any) {
        handleError(error);
        return [];
    }
}
