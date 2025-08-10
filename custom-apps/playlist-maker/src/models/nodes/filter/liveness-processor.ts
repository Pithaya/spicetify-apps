import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../workflow-track';
import { NodeProcessor } from '../node-processor';
import { BaseNodeDataSchema } from '../base-node-processor';

export const MIN_LIVENESS = 0;
export const MAX_LIVENESS = 1;

export const LivenessDataSchema = z
    .object({
        range: z.object({
            min: z.number().min(MIN_LIVENESS).max(MAX_LIVENESS),
            max: z.number().min(MIN_LIVENESS).max(MAX_LIVENESS),
        }),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type LivenessData = z.infer<typeof LivenessDataSchema>;

export class LivenessProcessor extends NodeProcessor<LivenessData> {
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
                track.audioFeatures.liveness > this.data.range.min &&
                track.audioFeatures.liveness < this.data.range.max,
        );

        return filtered;
    }
}
