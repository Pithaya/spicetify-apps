import { type WorkflowTrack } from '../../../types/workflow-track';
import { type BaseNodeData } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export class ReverseProcessor extends NodeProcessor<BaseNodeData> {
    protected override async getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        return Promise.resolve(input.toReversed());
    }
}
