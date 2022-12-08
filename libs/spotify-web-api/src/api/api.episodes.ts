import { handleError } from '../helpers';
import { Episode } from '../models/episode';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';

const baseUrl = `${spotifyWebApiBaseUrl}/episodes`;

/**
 * Get Spotify catalog information for a single episode identified by its unique Spotify ID.
 * @param id The Spotify ID for the episode.
 * @returns An episode.
 */
export async function getEpisode(id: string): Promise<Episode | null> {
    try {
        return await Spicetify.CosmosAsync.get(`${baseUrl}/${id}`);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}
