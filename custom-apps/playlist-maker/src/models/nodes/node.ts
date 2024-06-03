import type { LibraryAPITrack } from '@shared/platform/library';
import type { LocalTrack } from '@shared/platform/local-files';

export type Track = LibraryAPITrack | LocalTrack;

export abstract class WorkflowNode {
    /**
     * Get the result of this node.
     * @returns List of track after processing.
     */
    public abstract getResults(): Promise<Track[]>;
}
