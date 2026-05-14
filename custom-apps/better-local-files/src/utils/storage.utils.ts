const HAS_CACHE_KEY = 'better-local-files:has-cache';
const SCHEMA_VERSION_KEY = 'better-local-files:schema-version';

// Legacy key for merged albums
const MERGED_ALBUMS = 'local-files:merged-albums';

export const getHasCache = (): boolean => {
    const storedValue = localStorage.getItem(HAS_CACHE_KEY);

    if (storedValue === null) {
        setHasCache(false);
        return false;
    }

    return JSON.parse(storedValue) as boolean;
};

export const setHasCache = (value: boolean): void => {
    localStorage.setItem(HAS_CACHE_KEY, JSON.stringify(value));
};

export const getStoredSchemaVersion = (): number | null => {
    const storedValue = localStorage.getItem(SCHEMA_VERSION_KEY);

    if (storedValue === null) {
        return null;
    }

    const parsed = Number.parseInt(storedValue, 10);
    return Number.isNaN(parsed) ? null : parsed;
};

export const setStoredSchemaVersion = (value: number): void => {
    localStorage.setItem(SCHEMA_VERSION_KEY, value.toFixed());
};

export const clearLegacyCache = () => {
    localStorage.removeItem(MERGED_ALBUMS);
};
