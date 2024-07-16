import { type WorkflowTrack } from '../../track';
import { TrackWrapper } from '../../track-wrapper';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

export type IsPlayableData = BaseNodeData & {
    isPlayable: boolean;
};

export class IsPlayableProcessor extends NodeProcessor<IsPlayableData> {
    protected override async getResultsInternal(
        input: WorkflowTrack[],
    ): Promise<WorkflowTrack[]> {
        const filtered = input.filter(
            (track) =>
                new TrackWrapper(track).isPlayable === this.data.isPlayable,
        );

        return filtered;
    }
}
