import { type Track, NodeProcessor } from '../node-processor';

/**
 * Final node in the workflow.
 */
export class ResultNodeProcessor extends NodeProcessor {
    constructor(public readonly sourceNodeId: string) {
        super();
    }

    public override async getResults(
        processors: Record<string, NodeProcessor>,
    ): Promise<Track[]> {
        return await processors[this.sourceNodeId].getResults(processors);
    }
}