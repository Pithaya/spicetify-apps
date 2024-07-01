import { type Track } from '../../track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

/**
 * Final node in the workflow.
 */
export class ResultNodeProcessor extends NodeProcessor<BaseNodeData> {
    public override async getResults(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<Track[]> {
        return await this.getInputs(processors);
    }
}
