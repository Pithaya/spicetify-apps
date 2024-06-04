import { type Track, NodeProcessor } from '../node-processor';

export class DeduplicateProcessor extends NodeProcessor {
    constructor(public readonly sourceNodesIds: string[]) {
        super();
    }

    public override async getResults(
        processors: Record<string, NodeProcessor>,
    ): Promise<Track[]> {
        const tracks = [];

        for (const id of this.sourceNodesIds) {
            tracks.push(...(await processors[id].getResults(processors)));
        }

        const uris = tracks.map((track) => track.uri);
        const filtered = tracks.filter(
            (track, index) => !uris.includes(track.uri, index + 1),
        );

        return filtered;
    }
}
