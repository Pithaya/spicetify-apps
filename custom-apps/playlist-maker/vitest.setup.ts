import { vi } from 'vitest';

/**
 * The Zustand store imports reactflow and the node factories, which pull in
 * every processor — that creates a circular module graph when a spec imports
 * a single processor. `BaseNodeProcessor` only reads `updateNodeData` off the
 * store at construction, so a minimal stub is enough for unit tests.
 */
vi.mock('./src/stores/store', () => {
    const state = {
        updateNodeData: vi.fn(),
    };
    const useAppStore = Object.assign(() => state, {
        getState: () => state,
    });
    return {
        default: useAppStore,
        useAppStore,
    };
});

/**
 * `setAudioFeatures` reaches the Spotify Web API via the global `Spicetify`
 * object, which does not exist under vitest. Audio-feature filter specs are
 * expected to pre-populate `track.audioFeatures` on the tracks that should
 * match; this mock leaves every other track with `audioFeatures === undefined`,
 * which is exactly how the real function behaves when the Web API has no entry
 * for a track.
 */
vi.mock('./src/utils/track-utils', () => ({
    setAudioFeatures: vi.fn().mockResolvedValue(undefined),
}));

/**
 * Minimal stub of the `Spicetify` global. The production code injects it at
 * runtime; tests never see the real object. Add new properties here when a new
 * processor needs them — centralising keeps the surface area visible and
 * avoids per-spec `globalThis as unknown as ...` casts.
 */
vi.stubGlobal('Spicetify', {
    Locale: { getLocale: () => 'en' },
});
