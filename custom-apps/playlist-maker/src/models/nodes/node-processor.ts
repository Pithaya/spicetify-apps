import { z } from 'zod';
import useAppStore from '../../stores/store';
import type { WorkflowTrack } from '../workflow-track';

export const BaseNodeDataSchema = z
    .object({
        /**
         * Whether the node is currently executing.
         * Typed as true | undefined instead of boolean to avoid it being persisted as "false" when saving a workflow.
         */
        isExecuting: z.literal(true).optional(),
    })
    .strict();

export type BaseNodeData = z.infer<typeof BaseNodeDataSchema>;

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

        this.setExecuting(undefined);

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

    private setExecuting(isExecuting: true | undefined): void {
        this.updateNodeData<BaseNodeData>(this.currentNodeId, {
            isExecuting,
        });
    }
}
