import { AudioAnalysis } from '../models/audio-analysis';

/**
 * Get a low-level audio analysis for a track in the Spotify catalog.
 * The audio analysis describes the track’s structure and musical content, including rhythm, pitch, and timbre.
 * @param uri The Spotify ID for the track.
 * @returns Audio analysis for the track
 */
export async function getAudioAnalysis(id: string): Promise<AudioAnalysis> {
    return Spicetify.CosmosAsync.get(
        `wg://audio-attributes/v1/audio-analysis/${id}`
    );
}
