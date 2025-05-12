import { z } from 'zod';
import { TrackWrapper } from '../../track-wrapper';
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
        input: WorkflowTrack[],
    ): Promise<WorkflowTrack[]> {
        const filtered = input.filter(
            (track) =>
                new TrackWrapper(track).isPlayable === this.data.isPlayable,
        );

        return Promise.resolve(filtered);
    }
}
