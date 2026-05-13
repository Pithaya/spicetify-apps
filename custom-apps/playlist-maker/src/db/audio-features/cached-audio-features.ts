import type { AudioFeatures } from '@shared/api/models/audio-features';

/**
 * Cache entry for a track's audio features.
 */
export type CachedAudioFeatures = {
    /**
     * Track URI (unique, primary key).
     */
    uri: string;
    /**
     * Track name captured at cache time.
     */
    trackName: string;
    /**
     * Audio features payload returned by the spclient endpoint.
     */
    features: AudioFeatures;
};
