import useAppStore from '../../store/store';
import type { Track } from '../track';

export type BaseNodeData = {
    isExecuting: boolean;
};

// TODO: Keep cache of results

export abstract class NodeProcessor<T extends BaseNodeData> {
    private readonly updateNodeData = useAppStore.getState().updateNodeData;

    constructor(
        protected readonly currentNodeId: string,
        protected readonly sourceNodeIds: string[],
        protected readonly data: Readonly<T>,
    ) {}

    /**
     * Get the result of this node.
     * @param processors - Map of all processors in the workflow.
     * @returns List of track after processing.
     */
    public abstract getResults(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<Track[]>;

    protected async getInputs(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<Track[]> {
        const inputs: Track[] = [];

        for (const sourceNodeId of this.sourceNodeIds) {
            const processor = processors[sourceNodeId];

            if (!processor) {
                throw new Error(`Processor for node ${sourceNodeId} not found`);
            }

            inputs.push(...(await processor.getResults(processors)));
        }

        return inputs;
    }

    protected setExecuting(isExecuting: boolean): void {
        this.updateNodeData<BaseNodeData>(this.currentNodeId, {
            isExecuting,
        });
    }
}
