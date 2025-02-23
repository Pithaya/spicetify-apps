import { type WorkflowTrack } from '../../track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

export class DeduplicateProcessor extends NodeProcessor<BaseNodeData> {
    protected override async getResultsInternal(
        input: WorkflowTrack[],
    ): Promise<WorkflowTrack[]> {
        const uris = input.map((track) => track.uri);
        const filtered = input.filter(
            (track, index) => !uris.includes(track.uri, index + 1),
        );

        return filtered;
    }
}
