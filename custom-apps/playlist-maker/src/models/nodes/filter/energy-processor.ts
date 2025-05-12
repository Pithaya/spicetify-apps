import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const MIN_ENERGY = 0;
export const MAX_ENERGY = 1;

export const EnergyDataSchema = z
    .object({
        range: z.object({
            min: z.number().min(MIN_ENERGY).max(MAX_ENERGY),
            max: z.number().min(MIN_ENERGY).max(MAX_ENERGY),
        }),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type EnergyData = z.infer<typeof EnergyDataSchema>;

export class EnergyProcessor extends NodeProcessor<EnergyData> {
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
                track.audioFeatures.energy > this.data.range.min &&
                track.audioFeatures.energy < this.data.range.max,
        );

        return filtered;
    }
}
