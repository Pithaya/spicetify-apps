/**
 * An album stored in the cache.
 */
export type CachedAlbum = {
    /**
     * Album URI.
     */
    uri: string;

    /**
     * List of tracks URI to separate for this album.
     * Each array is a "sub-album" for this album.
     */
    tracks: string[][];
};
