import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';
import type { Track } from '@spotify-web-api';

export type BackingTrack = LocalTrack | LibraryAPITrack | Track;

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
     */
    addedAt: Date;

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
}
