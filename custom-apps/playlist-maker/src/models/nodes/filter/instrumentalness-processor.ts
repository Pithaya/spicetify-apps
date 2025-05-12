import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const MIN_INSTRUMENTALNESS = 0;
export const MAX_INSTRUMENTALNESS = 1;

export const InstrumentalnessDataSchema = z
    .object({
        range: z.object({
            min: z.number().min(MIN_INSTRUMENTALNESS).max(MAX_INSTRUMENTALNESS),
            max: z.number().min(MIN_INSTRUMENTALNESS).max(MAX_INSTRUMENTALNESS),
        }),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type InstrumentalnessData = z.infer<typeof InstrumentalnessDataSchema>;

export class InstrumentalnessProcessor extends NodeProcessor<InstrumentalnessData> {
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
                track.audioFeatures.instrumentalness > this.data.range.min &&
                track.audioFeatures.instrumentalness < this.data.range.max,
        );

        return filtered;
    }
}
