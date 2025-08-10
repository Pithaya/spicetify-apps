import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { NodeProcessor } from '../node-processor';
import { BaseNodeDataSchema } from '../base-node-processor';

export const MIN_VALENCE = 0;
export const MAX_VALENCE = 1;

export const ValenceDataSchema = z
    .object({
        range: z.object({
            min: z.number().min(MIN_VALENCE).max(MAX_VALENCE),
            max: z.number().min(MIN_VALENCE).max(MAX_VALENCE),
        }),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type ValenceData = z.infer<typeof ValenceDataSchema>;

export class ValenceProcessor extends NodeProcessor<ValenceData> {
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
                track.audioFeatures.valence > this.data.range.min &&
                track.audioFeatures.valence < this.data.range.max,
        );

        return filtered;
    }
}
