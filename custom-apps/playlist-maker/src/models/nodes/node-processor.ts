import type { WorkflowTrack } from '../workflow-track';
import { type BaseNodeData, BaseNodeProcessor } from './base-node-processor';

/**
 * Processor for a node that is not a result node.
 */
export abstract class NodeProcessor<
    T extends BaseNodeData,
> extends BaseNodeProcessor<T> {
    // The processor is recreated every workflow execution,
    // so the cache is only to avoid running the same node twice in the workflow
    private resultCache: WorkflowTrack[] | null = null;

    public override async getResults(
        processors: Record<string, NodeProcessor<BaseNodeData>>,
    ): Promise<WorkflowTrack[]> {
        const input = await this.getInputs(processors);

        this.setExecuting(true);

        this.resultCache ??= await this.getResultsInternal(input);

        this.setExecuting(undefined);

        return this.resultCache;
    }

    protected abstract getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]>;
}
