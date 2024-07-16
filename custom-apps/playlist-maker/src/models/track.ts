import type { BackingTrack } from '@shared/components/track-list/models/interfaces';

export type AdditionalTrackData = {
    source: string;
};

export type WorkflowTrack = BackingTrack & AdditionalTrackData;
