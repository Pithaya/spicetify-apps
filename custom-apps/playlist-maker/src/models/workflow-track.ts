import type { AudioFeatures } from '@shared/api/models/audio-features';
import type { ITrack } from '@shared/components/track-list/models/interfaces';

export type AdditionalAlbumData = {
    /**
     * Release date of the album.
     */
    releaseDate: Date;
};

export type AdditionalData = {
    /**
     * The source of the track, e.g., 'local files', an album name, playlist name, etc.
     */
    source: string;
    /**
     * Audio features of the track.
     */
    audioFeatures?: AudioFeatures;
    /**
     * Additional data related to the album of the track.
     */
    albumData?: AdditionalAlbumData;
};

/**
 * A track that is used in the workflow.
 * Contains data from the track and optionally additional data fetched from other sources.
 * The trackNumber and addedAt properties are omitted as they will not be used in the workflow or result grid.
 */
export type WorkflowTrack = Omit<ITrack, 'trackNumber' | 'addedAt'> &
    AdditionalData;
