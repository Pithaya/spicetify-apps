import type { CachedAlbum } from '../models/cached-album';

const HAS_CACHE_KEY = 'local-files:has-cache';
const MERGED_ALBUMS = 'local-files:merged-albums';

/**
 * Service to interact with the local storage.
 */
export class StorageService {
    /**
     * Returns true if the cache is set.
     * If false, the cache has to be built.
     */
    public get hasCache(): boolean {
        let storedValue = localStorage.getItem(HAS_CACHE_KEY);

        // Set to true by default to avoid a long first load
        if (storedValue === null) {
            const stringified = JSON.stringify(true);
            localStorage.setItem(HAS_CACHE_KEY, stringified);
            storedValue = stringified;
        }

        return JSON.parse(storedValue) as boolean;
    }

    /**
     * Sets the hasCache value.
     */
    public set hasCache(value: boolean) {
        localStorage.setItem(HAS_CACHE_KEY, JSON.stringify(value));
    }

    /**
     * Get the album cache.
     */
    public get cache(): CachedAlbum[] {
        let storedValue = localStorage.getItem(MERGED_ALBUMS);

        if (storedValue === null) {
            const stringified = JSON.stringify([]);
            localStorage.setItem(MERGED_ALBUMS, stringified);
            storedValue = stringified;
        }

        return JSON.parse(storedValue) as CachedAlbum[];
    }

    /**
     * Set the album cache.
     */
    public set cache(value: CachedAlbum[]) {
        localStorage.setItem(MERGED_ALBUMS, JSON.stringify(value));
    }
}
