import type { IArtist } from '@shared/components/track-list/models/interfaces';

export type CachedArtist = IArtist & {
    /**
     * Image to use for the artist's page. Usually the image of the artist's first album.
     */
    image: string;

    /**
     * Lowercase artist name for substring search and indexed sort.
     */
    nameLower: string;
};
