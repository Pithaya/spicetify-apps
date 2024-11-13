import { type WorkflowTrack } from '../../track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';
import { setAudioFeatures } from 'custom-apps/playlist-maker/src/utils/track-utils';

export type SpeechinessData = BaseNodeData & {
    range: {
        min: number;
        max: number;
    };
};

export class SpeechinessProcessor extends NodeProcessor<SpeechinessData> {
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
                track.audioFeatures?.speechiness > this.data.range.min &&
                track.audioFeatures?.speechiness < this.data.range.max,
        );

        return filtered;
    }
}
