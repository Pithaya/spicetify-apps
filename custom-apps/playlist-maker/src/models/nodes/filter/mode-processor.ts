import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../track';
import { BaseNodeDataSchema, NodeProcessor } from '../node-processor';

export const ModeDataSchema = z
    .object({
        mode: z.union([z.literal('0'), z.literal('1')]),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type ModeData = z.infer<typeof ModeDataSchema>;

export class ModeProcessor extends NodeProcessor<ModeData> {
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
                track.audioFeatures?.mode === +this.data.mode,
        );

        return filtered;
    }
}
