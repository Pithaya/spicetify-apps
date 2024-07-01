import { type Track } from '../../track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

export class ShuffleProcessor extends NodeProcessor<BaseNodeData> {
    public override async getResults(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<Track[]> {
        const tracks = await this.getInputs(processors);

        this.setExecuting(true);

        for (let i = tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
        }

        this.setExecuting(false);

        return tracks;
    }
}
