import { type Track } from '../../track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

export class ShuffleProcessor extends NodeProcessor<BaseNodeData> {
    protected override async getResultsInternal(
        input: Track[],
    ): Promise<Track[]> {
        for (let i = input.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [input[i], input[j]] = [input[j], input[i]];
        }

        return input;
    }
}
