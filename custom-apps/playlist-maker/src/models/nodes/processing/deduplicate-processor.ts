import { type Track } from '../../track';
import { NodeProcessor } from '../node-processor';

export class DeduplicateProcessor extends NodeProcessor {
    constructor(
        currentNodeId: string,
        public readonly sourceNodesIds: string[],
    ) {
        super(currentNodeId);
    }

    public override async getResults(
        processors: Record<string, NodeProcessor>,
    ): Promise<Track[]> {
        const tracks = [];

        for (const id of this.sourceNodesIds) {
            tracks.push(...(await processors[id].getResults(processors)));
        }

        this.setExecuting(true);

        const uris = tracks.map((track) => track.uri);
        const filtered = tracks.filter(
            (track, index) => !uris.includes(track.uri, index + 1),
        );

        this.setExecuting(false);

        return filtered;
    }
}
