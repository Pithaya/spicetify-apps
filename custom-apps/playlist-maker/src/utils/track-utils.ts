import type { AudioFeatures } from '@shared/api/models/audio-features';
import { getAudioFeatures } from '@shared/spclient/get-audio-features';
import type { WorkflowTrack } from '../types/workflow-track';

export async function setAudioFeatures(tracks: WorkflowTrack[]): Promise<void> {
    // Local tracks don't have audio features
    const filteredTracks = tracks.filter(
        (track) => !Spicetify.URI.isLocalTrack(track.uri),
    );

    for (const track of filteredTracks) {
        let feature: AudioFeatures | null = null;

        try {
            feature = await getAudioFeatures(track.uri);
            track.audioFeatures = feature;
        } catch (error) {
            console.error(
                `Failed to get audio features for track ${track.uri}:`,
                error,
            );
        }
    }
}
