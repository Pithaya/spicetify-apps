import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const MIN_TEMPO = 0;
export const MAX_TEMPO = 1000;

export const TempoDataSchema = z
    .object({
        range: z.object({
            min: z.number().min(MIN_TEMPO).max(MAX_TEMPO),
            max: z.number().min(MIN_TEMPO).max(MAX_TEMPO),
        }),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type TempoData = z.infer<typeof TempoDataSchema>;

export class TempoProcessor extends NodeProcessor<TempoData> {
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
                track.audioFeatures.tempo > this.data.range.min &&
                track.audioFeatures.tempo < this.data.range.max,
        );

        return filtered;
    }
}
