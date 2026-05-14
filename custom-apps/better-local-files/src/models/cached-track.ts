import type { ITrack } from '@shared/components/track-list/models/interfaces';

export type CachedTrack = ITrack & {
    /**
     * Disc number in the album.
     */
    discNumber: number;

    /**
     * Artists URIs for this track.
     */
    artistUris: string[];

    /**
     * Lowercase track name for substring search.
     */
    nameLower: string;

    /**
     * Lowercase album name for substring search and indexed sort.
     */
    albumNameLower: string;

    /**
     * Lowercase artist names for substring search.
     */
    artistNamesLower: string[];

    /**
     * Lowercase name of the first artist, for indexed sort by artist.
     */
    firstArtistNameLower: string;

    /**
     * `addedAt.getTime()` — `Date` is not indexable by Dexie so we keep a numeric copy.
     */
    addedAtTime: number;
};
