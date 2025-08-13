import { type WorkflowTrack } from '../../../types/workflow-track';
import { type BaseNodeData } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export class ShuffleProcessor extends NodeProcessor<BaseNodeData> {
    protected override async getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        for (let i = input.length - 1; i > 0; i--) {
            // eslint-disable-next-line sonarjs/pseudo-random
            const j = Math.floor(Math.random() * (i + 1));
            [input[i], input[j]] = [input[j], input[i]];
        }

        return Promise.resolve(input);
    }
}
