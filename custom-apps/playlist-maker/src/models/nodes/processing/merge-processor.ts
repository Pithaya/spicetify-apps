import { type Track, NodeProcessor } from '../node-processor';

export class MergeProcessor extends NodeProcessor {
    constructor(
        currentNodeId: string,
        public readonly sourceNodesIds: string[],
    ) {
        super(currentNodeId);
    }

    public override async getResults(
        processors: Record<string, NodeProcessor>,
    ): Promise<Track[]> {
        const result = [];

        for (const id of this.sourceNodesIds) {
            result.push(...(await processors[id].getResults(processors)));
        }

        return result;
    }
}
