import useAppStore from '../../store/store';
import type { Track } from '../track';

export type BaseNodeData = {
    isExecuting: boolean;
};

// TODO: Keep cache of results

export abstract class NodeProcessor {
    private readonly updateNodeData = useAppStore.getState().updateNodeData;

    constructor(public readonly currentNodeId: string) {}

    /**
     * Get the result of this node.
     * @param processors - Map of all processors in the workflow.
     * @returns List of track after processing.
     */
    public abstract getResults(
        processors: Record<string, NodeProcessor>,
    ): Promise<Track[]>;

    protected setExecuting(isExecuting: boolean): void {
        this.updateNodeData<BaseNodeData>(this.currentNodeId, {
            isExecuting,
        });
    }
}
