import {
    getTracksAudioFeatures,
    MAX_GET_MULTIPLE_AUDIO_FEATURES_IDS,
} from '@shared/api/endpoints/tracks/get-tracks-audio-features';
import type { AudioFeatures } from '@shared/api/models/audio-features';
import { splitInChunks } from '@shared/utils/array-utils';
import { wait } from '@shared/utils/promise-utils';
import type { WorkflowTrack } from '../models/track';

export async function setAudioFeatures(tracks: WorkflowTrack[]): Promise<void> {
    // Local tracks don't have audio features
    const filteredTracks = tracks.filter(
        (track) => !Spicetify.URI.isLocalTrack(track.uri),
    );

    const chunks = splitInChunks(
        filteredTracks,
        MAX_GET_MULTIPLE_AUDIO_FEATURES_IDS,
    );

    for (const chunk of chunks) {
        const chunkResult: (AudioFeatures | null)[] =
            await getTracksAudioFeatures({
                uris: chunk.map((track) => track.uri) as [string, ...string[]],
            });

        for (const track of chunk) {
            const feature = chunkResult.find(
                (result) => result !== null && result.uri === track.uri,
            );

            if (!feature) {
                continue;
            }

            track.audioFeatures = feature;
        }

        // TODO: Handle 429 error and use Retry-After header
        await wait(1000 / 50); // 50 requests per second
    }
}
