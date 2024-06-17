import type { Show } from '@spotify-web-api/models/show';
import { handleError } from '../helpers';
import { get } from '../utils/fetch-utils';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';

const baseUrl = `${spotifyWebApiBaseUrl}/shows`;

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
