import { type Track } from '../../track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

/**
 * Final node in the workflow.
 */
export class ResultNodeProcessor extends NodeProcessor<BaseNodeData> {
    protected override async getResultsInternal(
        input: Track[],
    ): Promise<Track[]> {
        return input;
    }
}
