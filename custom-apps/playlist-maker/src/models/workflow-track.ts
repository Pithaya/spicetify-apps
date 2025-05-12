import type { AudioFeatures } from '@shared/api/models/audio-features';
import type { BackingTrack } from '@shared/components/track-list/models/interfaces';

export type AdditionalTrackData = {
    source: string;
    audioFeatures?: AudioFeatures;
};

/**
 * A track that is used in the workflow.
 * It contains the backing track and additional data.
 */
export type WorkflowTrack = BackingTrack & AdditionalTrackData;
