import { type WorkflowTrack } from '../../workflow-track';
import { type BaseNodeData, NodeProcessor } from '../node-processor';

/**
 * Final node in the workflow.
 */
export class ResultNodeProcessor extends NodeProcessor<BaseNodeData> {
    protected override getResultsInternal(
        input: WorkflowTrack[],
    ): Promise<WorkflowTrack[]> {
        return Promise.resolve(input);
    }
}
