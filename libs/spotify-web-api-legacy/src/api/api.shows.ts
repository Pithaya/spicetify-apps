import type { Show } from '@spotify-web-api-legacy/models/show';
import { handleError } from '../helpers';
import { get } from '../utils/fetch-utils';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';
import { ArgumentError } from '@spotify-web-api-legacy/models/errors';

const baseUrl = `${spotifyWebApiBaseUrl}/shows`;

export const MAX_GET_MULTIPLE_SHOWS_IDS = 50;

/**
 * Get Spotify catalog information for a single show identified by its unique Spotify ID.
 * @param id The Spotify ID for the show.
 * @returns A show.
 */
export async function getShow(id: string): Promise<Show | null> {
    try {
        return await get(`${baseUrl}/${id}`);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}

/**
 * Get Spotify catalog information for multiple shows based on their Spotify IDs.
 * @param ids A comma-separated list of the Spotify IDs. Maximum: 50 IDs.
 * @returns A set of shows
 */
export async function getShows(ids: string[]): Promise<Show[]> {
    try {
        if (ids.length > MAX_GET_MULTIPLE_SHOWS_IDS) {
            throw new ArgumentError(
                `The maximum number of IDs is ${MAX_GET_MULTIPLE_SHOWS_IDS}.`,
            );
        }

        const result = await get<{ shows: Show[] }>(
            `${baseUrl}?ids=${ids.join(',')}`,
        );
        return result.shows;
    } catch (error: any) {
        handleError(error);
        return [];
    }
}
