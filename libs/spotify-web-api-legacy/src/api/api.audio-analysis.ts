import { handleError } from '../helpers';
import { baseUrl as spotifyWebApiBaseUrl } from '../variables';
import { get } from '../utils/fetch-utils';
import type { AudioAnalysis } from '../models/audio-analysis';

const baseUrl = `${spotifyWebApiBaseUrl}/audio-analysis`;

/**
 * Get a low-level audio analysis for a track in the Spotify catalog.
 * The audio analysis describes the track’s structure and musical content, including rhythm, pitch, and timbre.
 * @param id The Spotify ID for the track.
 * @returns The audio analysis if available.
 */
export async function getAudioAnalysis(
    id: string,
): Promise<AudioAnalysis | null> {
    try {
        return await get(`${baseUrl}/${id}`);
    } catch (error: any) {
        handleError(error);
        return null;
    }
}
