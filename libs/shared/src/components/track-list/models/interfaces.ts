import type { Track as WebAPITrack } from '@shared/api/models/track';
import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';

export type SimpleTrack = {
    uri: string;
    name: string;
    addedAt?: Date;
    duration: {
        milliseconds: number;
    };
    trackNumber: number;
    artists: IArtist[];
    album: IAlbum;
    isPlayable: boolean;
};

/**
 * The different types of tracks that can be made to match the ITrack interface.
 * This includes tracks from local files, library API, the web API, and a simple type to map other track types.
 */
export type BackingTrack =
    | LocalTrack
    | LibraryAPITrack
    | WebAPITrack
    | SimpleTrack;

/**
 * Interface representing a track from one of the BackingTrack types.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface ITrack {
    /**
     * Track URI.
     */
    uri: string;

    /**
     * Track name.
     */
    name: string;

    /**
     * Date the track was added to the library.
     * Null if the track is not in the library.
     */
    addedAt: Date | null;

    /**
     * Duration of the track in milliseconds.
     */
    duration: number;

    /**
     * Track number in the album.
     */
    trackNumber: number;

    /**
     * Artists for this track.
     */
    artists: IArtist[];

    /**
     * Album for this track.
     */
    album: IAlbum;

    /**
     * Internal track.
     */
    backingTrack: BackingTrack;

    /**
     * Source of the track.
     */
    source?: string;

    /**
     * If the track is playable.
     */
    isPlayable: boolean;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface IArtist {
    /**
     * Artist URI.
     */
    uri: string;

    /**
     * Artist name.
     */
    name: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface IAlbum {
    /**
     * Album URI.
     */
    uri: string;

    /**
     * Album name.
     */
    name: string;

    /**
     * Album images.
     */
    images: {
        url: string;
    }[];
}
