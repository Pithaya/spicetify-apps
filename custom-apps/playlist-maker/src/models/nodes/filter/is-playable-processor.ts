import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const IsPlayableDataSchema = z
    .object({
        isPlayable: z.boolean(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type IsPlayableData = z.infer<typeof IsPlayableDataSchema>;

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
