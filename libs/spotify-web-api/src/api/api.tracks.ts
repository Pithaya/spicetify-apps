import { handleError } from '../helpers';
import type { Track } from '../models/track';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';
import { get } from '../utils/fetch-utils';

const baseUrl = `${spotifyWebApiBaseUrl}/tracks`;

/**
 * Get Spotify catalog information for a single track identified by its unique Spotify ID.
 * @param id The Spotify ID for the track.
 * @returns A track.
 */
export async function getTrack(id: string): Promise<Track | null> {
    try {
        return await get(`${baseUrl}/${id}`);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}
