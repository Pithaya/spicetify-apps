import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const MIN_ACOUSTICNESS = 0;
export const MAX_ACOUSTICNESS = 1;

export const AcousticnessDataSchema = z
    .object({
        range: z.object({
            min: z.number().min(MIN_ACOUSTICNESS).max(MAX_ACOUSTICNESS),
            max: z.number().min(MIN_ACOUSTICNESS).max(MAX_ACOUSTICNESS),
        }),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type AcousticnessData = z.infer<typeof AcousticnessDataSchema>;

export const DEFAULT_ACOUSTICNESS_DATA: AcousticnessData = {
    range: {
        min: MIN_ACOUSTICNESS,
        max: MAX_ACOUSTICNESS,
    },
    isExecuting: undefined,
};

export class AcousticnessProcessor extends NodeProcessor<AcousticnessData> {
    protected override async getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        const tracksWithoutAudioFeatures = input.filter(
            (track) => track.audioFeatures === undefined,
        );

        await setAudioFeatures(tracksWithoutAudioFeatures);

        const filtered = input.filter(
            (track) =>
                track.audioFeatures !== undefined &&
                track.audioFeatures.acousticness > this.data.range.min &&
                track.audioFeatures.acousticness < this.data.range.max,
        );

        return filtered;
    }
}
