import { type WorkflowTrack } from '../../track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';
import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';

export type AcousticnessData = BaseNodeData & {
    range: {
        min: number;
        max: number;
    };
};

export class AcousticnessProcessor extends NodeProcessor<AcousticnessData> {
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
                track.audioFeatures?.acousticness > this.data.range.min &&
                track.audioFeatures?.acousticness < this.data.range.max,
        );

        return filtered;
    }
}
