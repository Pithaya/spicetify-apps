import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const IsPlayableDataSchema = z
    .object({
        isPlayable: z.boolean(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type IsPlayableData = z.infer<typeof IsPlayableDataSchema>;

export const DEFAULT_IS_PLAYABLE_DATA: IsPlayableData = {
    isPlayable: true,
    isExecuting: undefined,
};

export class IsPlayableProcessor extends NodeProcessor<IsPlayableData> {
    protected override async getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        const filtered = input.filter(
            (track) => track.isPlayable === this.data.isPlayable,
        );

        return Promise.resolve(filtered);
    }
}
