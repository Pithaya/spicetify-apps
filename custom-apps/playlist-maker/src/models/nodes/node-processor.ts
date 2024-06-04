import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';

export type Track = LibraryAPITrack | LocalTrack;

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
