import { z } from 'zod';
import useAppStore from '../../stores/store';
import type { WorkflowTrack } from '../workflow-track';
import { type NodeProcessor } from './node-processor';

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

export abstract class BaseNodeProcessor<T extends BaseNodeData> {
    private readonly updateNodeData = useAppStore.getState().updateNodeData;

    /**
     * Creates a new NodeProcessor.
     * @param currentNodeId - The ID of the current node.
     * @param sourceNodeIds - Map of source node IDs mapped to a specific handle. For nodes with a single handle, the default handle is "source".
     * @param data - The data associated with the node.
     */
    constructor(
        protected readonly currentNodeId: string,
        protected readonly sourceNodeIds: Record<string, string[]>,
        protected readonly data: Readonly<T>,
    ) {}

    /**
     * Get the result of this node.
     * @param processors - Map of all processors in the workflow.
     * @returns List of track after processing.
     */
    public abstract getResults(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<WorkflowTrack[]>;

    protected async getInputs(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<Record<string, WorkflowTrack[]>> {
        const inputs: Record<string, WorkflowTrack[]> = {};

        for (const [handle, nodeIds] of Object.entries(this.sourceNodeIds)) {
            inputs[handle] = [];

            for (const sourceNodeId of nodeIds) {
                const processor = processors[sourceNodeId] as
                    | NodeProcessor<BaseNodeData>
                    | undefined;

                if (processor === undefined) {
                    throw new Error(
                        `Processor for node ${sourceNodeId} not found`,
                    );
                }

                inputs[handle].push(
                    ...(await processor.getResults(processors)),
                );
            }
        }

        return inputs;
    }

    protected setExecuting(isExecuting: true | undefined): void {
        this.updateNodeData<BaseNodeData>(this.currentNodeId, {
            isExecuting,
        });
    }
}
