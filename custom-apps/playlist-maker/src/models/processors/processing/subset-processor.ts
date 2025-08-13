import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const SubsetDataSchema = z
    .object({
        count: z.number().nonnegative().int().min(1).optional(),
        type: z.enum(['first', 'last']),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type SubsetData = z.infer<typeof SubsetDataSchema>;

export const DEFAULT_SUBSET_DATA: SubsetData = {
    count: undefined,
    type: 'first',
    isExecuting: undefined,
};

export class SubsetProcessor extends NodeProcessor<SubsetData> {
    protected override async getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        const { count = 0, type } = this.data;

        const result =
            type === 'first' ? input.slice(0, count) : input.slice(-count);

        return Promise.resolve(result);
    }
}
