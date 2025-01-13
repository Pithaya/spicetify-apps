import type { BackingTrack } from '@shared/components/track-list/models/interfaces';
import type { AudioFeatures } from '@spotify-web-api';

export type AdditionalTrackData = {
    source: string;
    audioFeatures?: AudioFeatures;
};

export type WorkflowTrack = BackingTrack & AdditionalTrackData;
