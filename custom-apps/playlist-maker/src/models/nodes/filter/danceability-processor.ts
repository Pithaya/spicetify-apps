import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { NodeProcessor } from '../node-processor';
import { BaseNodeDataSchema } from '../base-node-processor';

export const MIN_DANCEABILITY = 0;
export const MAX_DANCEABILITY = 1;

export const DanceabilityDataSchema = z
    .object({
        range: z.object({
            min: z.number().min(MIN_DANCEABILITY).max(MAX_DANCEABILITY),
            max: z.number().min(MIN_DANCEABILITY).max(MAX_DANCEABILITY),
        }),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type DanceabilityData = z.infer<typeof DanceabilityDataSchema>;

export class DanceabilityProcessor extends NodeProcessor<DanceabilityData> {
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
                track.audioFeatures.danceability > this.data.range.min &&
                track.audioFeatures.danceability < this.data.range.max,
        );

        return filtered;
    }
}
