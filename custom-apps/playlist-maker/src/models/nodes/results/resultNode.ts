import { type Track, WorkflowNode } from '../node';

/**
 * Final node in the workflow.
 */
export class ResultNode extends WorkflowNode {
    constructor(public readonly source: WorkflowNode) {
        super();
    }

    public async getResults(): Promise<Track[]> {
        return await this.source.getResults();
    }
}
