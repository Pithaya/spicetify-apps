import { handleError } from '../helpers';
import type { Track } from '../models/track';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';
import { get } from '../utils/fetch-utils';
import { ArgumentError } from '@spotify-web-api-legacy/models/errors';

const baseUrl = `${spotifyWebApiBaseUrl}/tracks`;

export const MAX_GET_MULTIPLE_TRACKS_IDS = 50;

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

/**
 * Get Spotify catalog information for multiple tracks based on their Spotify IDs.
 * @param ids A comma-separated list of the Spotify IDs. Maximum: 50 IDs.
 * @returns A set of tracks
 */
export async function getTracks(ids: string[]): Promise<Track[]> {
    try {
        if (ids.length > MAX_GET_MULTIPLE_TRACKS_IDS) {
            throw new ArgumentError(
                `The maximum number of IDs is ${MAX_GET_MULTIPLE_TRACKS_IDS}.`,
            );
        }

        const result = await get<{ tracks: Track[] }>(
            `${baseUrl}?ids=${ids.join(',')}`,
        );
        return result.tracks;
    } catch (error: any) {
        handleError(error);
        return [];
    }
}
