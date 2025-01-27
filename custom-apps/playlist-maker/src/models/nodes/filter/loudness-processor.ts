import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const MIN_LOUDNESS = -60;
export const MAX_LOUDNESS = 10;

export const LoudnessDataSchema = z
    .object({
        range: z.object({
            min: z.number().min(MIN_LOUDNESS).max(MAX_LOUDNESS),
            max: z.number().min(MIN_LOUDNESS).max(MAX_LOUDNESS),
        }),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type LoudnessData = z.infer<typeof LoudnessDataSchema>;

export class LoudnessProcessor extends NodeProcessor<LoudnessData> {
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
                track.audioFeatures?.loudness > this.data.range.min &&
                track.audioFeatures?.loudness < this.data.range.max,
        );

        return filtered;
    }
}
