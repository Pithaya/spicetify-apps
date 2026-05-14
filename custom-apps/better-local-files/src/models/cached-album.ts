import type { IArtist } from '@shared/components/track-list/models/interfaces';

export type CachedAlbum = {
    /**
     * Album URI.
     */
    uri: string;

    /**
     * Album name.
     */
    name: string;

    /**
     * Lowercase album name for substring search and indexed sort.
     */
    nameLower: string;

    /**
     * Image to use for this album (first track's image).
     */
    image: string;

    /**
     * Artists for this album.
     */
    artists: IArtist[];

    /**
     * Lowercase artist names for substring search (multi-entry index).
     */
    artistNamesLower: string[];

    /**
     * Album tracks grouped by disc number.
     */
    discs: Record<number, string[]>;
};
