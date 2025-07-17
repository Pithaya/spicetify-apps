import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const MIN_SPEECHINESS = 0;
export const MAX_SPEECHINESS = 1;

export const SpeechinessDataSchema = z
    .object({
        range: z.object({
            min: z.number().min(MIN_SPEECHINESS).max(MAX_SPEECHINESS),
            max: z.number().min(MIN_SPEECHINESS).max(MAX_SPEECHINESS),
        }),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type SpeechinessData = z.infer<typeof SpeechinessDataSchema>;

export class SpeechinessProcessor extends NodeProcessor<SpeechinessData> {
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
                track.audioFeatures.speechiness > this.data.range.min &&
                track.audioFeatures.speechiness < this.data.range.max,
        );

        return filtered;
    }
}
