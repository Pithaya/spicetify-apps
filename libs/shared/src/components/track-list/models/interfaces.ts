/* eslint-disable @typescript-eslint/consistent-type-definitions */

/**
 * Interface for a track to be used in the track list.
 * Includes the minimum required properties to display a track in the list.
 */
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
     * Source of the track.
     */
    source?: string;

    /**
     * If the track is playable.
     */
    isPlayable: boolean;
}

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
    images: IAlbumImage[];
}

export interface IAlbumImage {
    /**
     * Image URL.
     */
    url: string;
}
