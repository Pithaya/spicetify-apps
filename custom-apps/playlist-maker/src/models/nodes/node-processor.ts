import useAppStore from '../../stores/store';
import type { Track } from '../track';

export type BaseNodeData = {
    isExecuting: boolean;
};

export type LocalNodeData<TNodeData extends BaseNodeData> = Omit<
    TNodeData,
    'isExecuting'
>;

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
    public async getResults(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<Track[]> {
        const input = await this.getInputs(processors);

        this.setExecuting(true);

        const result = await this.getResultsInternal(input);

        this.setExecuting(false);

        return result;
    }

    protected abstract getResultsInternal(input: Track[]): Promise<Track[]>;

    private async getInputs(
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

    private setExecuting(isExecuting: boolean): void {
        this.updateNodeData<BaseNodeData>(this.currentNodeId, {
            isExecuting,
        });
    }
}
