import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const IsExplicitDataSchema = z
    .object({
        isExplicit: z.boolean(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type IsExplicitData = z.infer<typeof IsExplicitDataSchema>;

export const DEFAULT_IS_EXPLICIT_DATA: IsExplicitData = {
    isExplicit: false,
    isExecuting: undefined,
};

export class IsExplicitProcessor extends NodeProcessor<IsExplicitData> {
    protected override async getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        const filtered = input.filter(
            (track) => track.isExplicit === this.data.isExplicit,
        );

        return Promise.resolve(filtered);
    }
}
