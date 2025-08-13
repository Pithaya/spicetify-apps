import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

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

export const DEFAULT_INSTRUMENTALNESS_DATA: InstrumentalnessData = {
    range: {
        min: MIN_INSTRUMENTALNESS,
        max: MAX_INSTRUMENTALNESS,
    },
    isExecuting: undefined,
};

export class InstrumentalnessProcessor extends NodeProcessor<InstrumentalnessData> {
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
                track.audioFeatures.instrumentalness > this.data.range.min &&
                track.audioFeatures.instrumentalness < this.data.range.max,
        );

        return filtered;
    }
}
