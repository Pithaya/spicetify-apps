import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const DurationDataSchema = z
    .object({
        minDuration: z.number().int().optional(),
        maxDuration: z.number().int().optional(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type DurationData = z.infer<typeof DurationDataSchema>;

export const DEFAULT_DURATION_DATA: DurationData = {
    minDuration: undefined,
    maxDuration: undefined,
    isExecuting: undefined,
};

/**
 * Filter node that filters tracks based on their duration.
 */
export class DurationProcessor extends NodeProcessor<DurationData> {
    protected override getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        const { minDuration, maxDuration } = this.data;

        // Minutes to milliseconds
        const minDurationMs =
            minDuration !== undefined ? minDuration * 60000 : undefined;
        const maxDurationMs =
            maxDuration !== undefined ? maxDuration * 60000 : undefined;

        const filtered = input.filter((track) => {
            const duration = track.duration;

            return (
                (minDurationMs !== undefined
                    ? duration >= minDurationMs
                    : true) &&
                (maxDurationMs !== undefined ? duration <= maxDurationMs : true)
            );
        });

        return Promise.resolve(filtered);
    }
}
