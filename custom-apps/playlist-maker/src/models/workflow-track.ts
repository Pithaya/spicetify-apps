import type { AudioFeatures } from '@shared/api/models/audio-features';
import type { BackingTrack } from '@shared/components/track-list/models/interfaces';

export type AdditionalTrackData = {
    source: string;
    audioFeatures?: AudioFeatures;
};

export type WorkflowTrack = BackingTrack & AdditionalTrackData;
