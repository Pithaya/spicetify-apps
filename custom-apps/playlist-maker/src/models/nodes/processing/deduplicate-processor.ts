import { type WorkflowTrack } from '../../workflow-track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

export class DeduplicateProcessor extends NodeProcessor<BaseNodeData> {
    protected override getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        const uniqueSongNames = new Set<string>();
        const uniqueTracks: WorkflowTrack[] = [];

        for (const track of input) {
            const artists = track.artists.map((a) => a.name).join(',');
            const songName = `${track.name.toLowerCase()}-${artists.toLowerCase()}`;

            if (uniqueSongNames.has(songName)) {
                continue;
            }

            uniqueTracks.push(track);
            uniqueSongNames.add(songName);
        }

        return Promise.resolve(uniqueTracks);
    }
}
