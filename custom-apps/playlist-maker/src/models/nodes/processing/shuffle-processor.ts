import { type Track } from '../../track';
import { NodeProcessor } from '../node-processor';

export class ShuffleProcessor extends NodeProcessor {
    constructor(
        currentNodeId: string,
        public readonly sourceNodeId: string,
    ) {
        super(currentNodeId);
    }

    public override async getResults(
        processors: Record<string, NodeProcessor>,
    ): Promise<Track[]> {
        const result =
            await processors[this.sourceNodeId].getResults(processors);

        this.setExecuting(true);

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        this.setExecuting(false);

        return result;
    }
}
