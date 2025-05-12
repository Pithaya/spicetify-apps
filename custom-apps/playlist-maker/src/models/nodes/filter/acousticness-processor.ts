import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

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

export class AcousticnessProcessor extends NodeProcessor<AcousticnessData> {
    protected override async getResultsInternal(
        input: WorkflowTrack[],
    ): Promise<WorkflowTrack[]> {
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
