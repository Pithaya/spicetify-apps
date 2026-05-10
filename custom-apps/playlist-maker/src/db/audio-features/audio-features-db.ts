import { Dexie, type EntityTable } from 'dexie';
import type { CachedAudioFeatures } from './cached-audio-features';

const dbName = 'playlist-maker:audio-features';
const dbVersion = 1;

const audioFeaturesDb = new Dexie(dbName) as Dexie & {
    audioFeatures: EntityTable<CachedAudioFeatures, 'uri'>;
};

audioFeaturesDb.version(dbVersion).stores({
    audioFeatures: '&uri, trackName',
});

/**
 * Get a cached audio features entry by track URI.
 * @param uri The track URI.
 * @returns The cached entry or undefined if not present.
 */
export const getCachedAudioFeatures = async (
    uri: string,
): Promise<CachedAudioFeatures | undefined> => {
    return await audioFeaturesDb.audioFeatures.get(uri);
};

/**
 * Insert or update a cached audio features entry.
 * @param entry The entry to cache.
 */
export const cacheAudioFeatures = async (
    entry: CachedAudioFeatures,
): Promise<void> => {
    await audioFeaturesDb.audioFeatures.put(entry);
};

/**
 * Get cached audio features sorted by track name, optionally filtered by
 * a substring matching either the track name or the URI.
 * @param search The search term.
 * @returns Matching cached entries, sorted by track name.
 */
export const getAllSorted = async (
    search: string,
): Promise<CachedAudioFeatures[]> => {
    const lowered = search.toLowerCase();

    return await audioFeaturesDb.audioFeatures
        .orderBy('trackName')
        .filter((entry) => {
            return (
                entry.trackName.toLowerCase().includes(lowered) ||
                entry.uri.toLowerCase().includes(lowered)
            );
        })
        .toArray();
};

/**
 * Remove every cached audio features entry.
 */
export const clearAll = async (): Promise<void> => {
    await audioFeaturesDb.audioFeatures.clear();
};
