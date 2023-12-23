export type LibraryAPI = {
    add: (param: { uris: string[]; silent?: boolean }) => Promise<void>;
    remove: (param: { uris: string[]; silent?: boolean }) => Promise<void>;

    /**
     * Check if an URI is in the library using the cache.
     * If the item is not in the cache, return undefined.
     * @param uri
     * @returns
     */
    containsSync: (uri: string) => boolean | undefined;
    contains: (...uris: string[]) => Promise<boolean[]>;
};
