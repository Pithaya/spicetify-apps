import { getAudioFeatures } from '@shared/spclient/get-audio-features';
import {
    cacheAudioFeatures,
    getCachedAudioFeatures,
} from '../db/audio-features/audio-features-db';
import type { WorkflowTrack } from '../types/workflow-track';

export async function setAudioFeatures(tracks: WorkflowTrack[]): Promise<void> {
    // Local tracks don't have audio features
    const filteredTracks = tracks.filter(
        (track) => !Spicetify.URI.isLocalTrack(track.uri),
    );

    for (const track of filteredTracks) {
        try {
            const cached = await getCachedAudioFeatures(track.uri);
            if (cached) {
                track.audioFeatures = cached.features;
                continue;
            }

            const feature = await getAudioFeatures(track.uri);
            track.audioFeatures = feature;
            await cacheAudioFeatures({
                uri: track.uri,
                trackName: track.name,
                features: feature,
            });
        } catch (error) {
            console.error(
                `Failed to get audio features for track ${track.uri}:`,
                error,
            );
        }
    }
}
