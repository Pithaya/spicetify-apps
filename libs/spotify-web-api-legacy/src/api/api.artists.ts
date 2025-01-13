import { handleError } from '../helpers';
import type { Album } from '../models/album';
import type { AlbumPageParameters } from '../models/album-page-parameters';
import type { Artist } from '../models/artist';
import type { Page } from '../models/page';
import { ArgumentError } from '../models/errors';
import { EmptyPage } from '../models/page';
import { get } from '../utils/fetch-utils';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';

const baseUrl = `${spotifyWebApiBaseUrl}/artists`;

export const MAX_GET_MULTIPLE_ARTISTS_IDS = 50;

/**
 * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
 * @param id The Spotify ID of the artist.
 * @returns An artist.
 */
export async function getArtist(id: string): Promise<Artist | null> {
    try {
        return await get(`${baseUrl}/${id}`);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}

/**
 * Get Spotify catalog information for several artists based on their Spotify IDs.
 * @param ids Spotify IDs for the artists. Maximum: 100 IDs.
 * @returns A set of artists.
 */
export async function getArtists(ids: string[]): Promise<Artist[]> {
    try {
        if (ids.length > MAX_GET_MULTIPLE_ARTISTS_IDS) {
            throw new ArgumentError(
                `The maximum number of IDs is ${MAX_GET_MULTIPLE_ARTISTS_IDS}.`,
            );
        }

        const result = await get<{ artists: Artist[] }>(
            `${baseUrl}?ids=${ids.join(',')}`,
        );
        return result.artists;
    } catch (error: any) {
        handleError(error);
        return [];
    }
}

/**
 * Get Spotify catalog information about an artist's albums.
 * @param id The Spotify ID of the artist.
 * @param parameters Query parameters.
 * @returns A page of content.
 */
export async function getArtistAlbums(
    id: string,
    parameters: AlbumPageParameters,
): Promise<Page<Album>> {
    try {
        return await get(
            `${baseUrl}/${id}/albums?${parameters.toQueryString()}`,
        );
    } catch (error: any) {
        handleError(error);
        return new EmptyPage<Album>();
    }
}
