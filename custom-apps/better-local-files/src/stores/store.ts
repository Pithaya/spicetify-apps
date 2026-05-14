import { create } from 'zustand';
import { clearDatabase, dbVersion } from '../db/db';
import { buildCache } from '../utils/cache.utils';
import {
    clearLegacyCache,
    getHasCache,
    getStoredSchemaVersion,
    setHasCache,
    setStoredSchemaVersion,
} from '../utils/storage.utils';

export type AppState = {
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    processedAlbums: number;
    setProcessedAlbums: (value: number) => void;
    totalAlbums: number;
    setTotalAlbums: (value: number) => void;
    clearCache: () => Promise<void>;
    rebuildCache: () => Promise<void>;
    initCache: () => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
    isLoading: true,
    setIsLoading: (value: boolean) => {
        set({ isLoading: value });
    },
    processedAlbums: 0,
    setProcessedAlbums: (value: number) => {
        set({ processedAlbums: value });
    },
    totalAlbums: 0,
    setTotalAlbums: (value: number) => {
        set({ totalAlbums: value });
    },
    clearCache: async () => {
        // Prevent action spam
        if (get().isLoading) {
            return;
        }

        set({ processedAlbums: 0, totalAlbums: 0, isLoading: true });
        await clearDatabase();
        setHasCache(false);
        set({ isLoading: false });
    },
    rebuildCache: async () => {
        // Prevent action spam
        if (get().isLoading) {
            return;
        }

        set({ processedAlbums: 0, totalAlbums: 0, isLoading: true });
        await clearDatabase();

        setHasCache(false);
        await buildCache();
        setStoredSchemaVersion(dbVersion);
        set({ isLoading: false });
    },
    initCache: async () => {
        // Clear legacy cache
        clearLegacyCache();

        // If the schema changed since the last run, the existing cache is unusable.
        const storedSchema = getStoredSchemaVersion();
        if (storedSchema !== dbVersion) {
            await clearDatabase();
            setHasCache(false);
        }

        if (getHasCache()) {
            set({ isLoading: false });
            // TODO: Check if cache is up to date
        } else {
            await buildCache();
            setStoredSchemaVersion(dbVersion);
            set({ isLoading: false });
        }
    },
}));

export default useAppStore;
