import { type WorkflowTrack } from '../../types/workflow-track';
import { type BaseNodeData, BaseNodeProcessor } from './base-node-processor';
import { type NodeProcessor } from './node-processor';

/**
 * Processor for a result node.
 */
export abstract class ResultNodeProcessor<
    T extends BaseNodeData,
> extends BaseNodeProcessor<T> {
    public override async getResults(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<WorkflowTrack[]> {
        const inputByHandle = await this.getInputs(processors);
        return Promise.resolve(inputByHandle['source'] ?? []);
    }

    public async executeResultAction(tracks: WorkflowTrack[]): Promise<void> {
        this.setExecuting(true);

        await this.executeResultActionInternal(tracks);

        this.setExecuting(undefined);
    }

    protected abstract executeResultActionInternal(
        tracks: WorkflowTrack[],
    ): Promise<void> | void;
}
