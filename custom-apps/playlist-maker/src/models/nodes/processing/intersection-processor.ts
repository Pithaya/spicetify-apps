import { type WorkflowTrack } from '../../workflow-track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

export class IntersectionProcessor extends NodeProcessor<BaseNodeData> {
    protected override getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const firstSetTracks = inputByHandle['first-set'] ?? [];
        const secondSetTracks = inputByHandle['second-set'] ?? [];
        const allTracks = [...firstSetTracks, ...secondSetTracks];

        const firstSet = new Set(firstSetTracks.map((track) => track.uri));
        const secondSet = new Set(secondSetTracks.map((track) => track.uri));
        const intersection = firstSet.intersection(secondSet);

        const result = [];
        const addedTracks = new Set<string>();

        for (const track of allTracks) {
            if (intersection.has(track.uri) && !addedTracks.has(track.uri)) {
                result.push(track);
                addedTracks.add(track.uri);
            }
        }

        return Promise.resolve(result);
    }
}
