import { ArgumentError } from '@spotify-web-api-legacy/models/errors';
import { handleError } from '../helpers';
import type { Episode } from '../models/episode';
import { get } from '../utils/fetch-utils';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';

const baseUrl = `${spotifyWebApiBaseUrl}/episodes`;

export const MAX_GET_MULTIPLE_EPISODES_IDS = 50;

/**
 * Get Spotify catalog information for a single episode identified by its unique Spotify ID.
 * @param id The Spotify ID for the episode.
 * @returns An episode.
 */
export async function getEpisode(id: string): Promise<Episode | null> {
    try {
        return await get(`${baseUrl}/${id}`);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}

/**
 * Get Spotify catalog information for multiple episodes based on their Spotify IDs.
 * @param ids A comma-separated list of the Spotify IDs. Maximum: 50 IDs.
 * @returns A set of episodes
 */
export async function getEpisodes(ids: string[]): Promise<Episode[]> {
    try {
        if (ids.length > MAX_GET_MULTIPLE_EPISODES_IDS) {
            throw new ArgumentError(
                `The maximum number of IDs is ${MAX_GET_MULTIPLE_EPISODES_IDS}.`,
            );
        }

        const result = await get<{ episodes: Episode[] }>(
            `${baseUrl}?ids=${ids.join(',')}`,
        );
        return result.episodes;
    } catch (error: any) {
        handleError(error);
        return [];
    }
}
