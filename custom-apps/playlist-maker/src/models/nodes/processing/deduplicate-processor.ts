import { type Track } from '../../track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

export class DeduplicateProcessor extends NodeProcessor<BaseNodeData> {
    public override async getResults(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<Track[]> {
        const tracks = await this.getInputs(processors);

        this.setExecuting(true);

        const uris = tracks.map((track) => track.uri);
        const filtered = tracks.filter(
            (track, index) => !uris.includes(track.uri, index + 1),
        );

        this.setExecuting(false);

        return filtered;
    }
}
