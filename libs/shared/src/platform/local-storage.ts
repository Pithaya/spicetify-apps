type StoredValue = object | string | number;

export type LocalStorageAPI = {
    clearItem: (key: string) => void;
    /**
     * Get an item from the user's namespace in local storage.
     * Throws an error if the item does not exist.
     * @param key The key to get from local storage.
     * @returns The value stored at the key.
     */
    getItem: (key: string) => StoredValue;
    setItem: (key: string, item: StoredValue) => void;
};
