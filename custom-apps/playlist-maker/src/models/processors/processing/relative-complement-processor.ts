import { type WorkflowTrack } from '../../../types/workflow-track';
import { type BaseNodeData } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export class RelativeComplementProcessor extends NodeProcessor<BaseNodeData> {
    protected override getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const firstSetTracks = inputByHandle['first-set'] ?? [];
        const secondSetTracks = inputByHandle['second-set'] ?? [];
        const allTracks = [...firstSetTracks, ...secondSetTracks];

        const firstSet = new Set(firstSetTracks.map((track) => track.uri));
        const secondSet = new Set(secondSetTracks.map((track) => track.uri));
        const complement = firstSet.difference(secondSet);

        const result = [];
        const addedTracks = new Set<string>();

        for (const track of allTracks) {
            if (complement.has(track.uri) && !addedTracks.has(track.uri)) {
                result.push(track);
                addedTracks.add(track.uri);
            }
        }

        return Promise.resolve(result);
    }
}
