import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';
import type { AudioAnalysis } from '@spotify-web-api/models/audio-analysis';

export type Track = (LibraryAPITrack | LocalTrack) & {
    genres?: Set<string>;
    analysis?: AudioAnalysis;
};

// TODO: Keep cache of results
export abstract class NodeProcessor {
    /**
     * Get the result of this node.
     * @param processors - Map of all processors in the workflow.
     * @returns List of track after processing.
     */
    public abstract getResults(
        processors: Record<string, NodeProcessor>,
    ): Promise<Track[]>;
}
