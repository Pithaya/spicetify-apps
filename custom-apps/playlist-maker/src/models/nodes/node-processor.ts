import useAppStore from '../../stores/store';
import type { WorkflowTrack } from '../track';

export type BaseNodeData = {
    isExecuting: boolean;
};

export type LocalNodeData<TNodeData extends BaseNodeData> = Omit<
    TNodeData,
    'isExecuting'
>;

export abstract class NodeProcessor<T extends BaseNodeData> {
    private readonly updateNodeData = useAppStore.getState().updateNodeData;
    private resultCache: WorkflowTrack[] | null = null;

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
    ): Promise<WorkflowTrack[]> {
        const input = await this.getInputs(processors);

        this.setExecuting(true);

        if (this.resultCache === null) {
            this.resultCache = await this.getResultsInternal(input);
        }

        this.setExecuting(false);

        return this.resultCache;
    }

    protected abstract getResultsInternal(
        input: WorkflowTrack[],
    ): Promise<WorkflowTrack[]>;

    private async getInputs(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<WorkflowTrack[]> {
        const inputs: WorkflowTrack[] = [];

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
