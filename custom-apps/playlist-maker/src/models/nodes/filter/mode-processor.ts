import { type WorkflowTrack } from '../../track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';
import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';

export type ModeData = BaseNodeData & {
    mode: string;
};

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
