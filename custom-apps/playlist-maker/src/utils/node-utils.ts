import { type Edge, getIncomers, type Node } from 'reactflow';
import { type CustomNodeType } from '../models/nodes/node-types';
import { ResultNodeProcessor } from '../models/nodes/results/result-node-processor';
import { type NodeProcessor } from '../models/nodes/node-processor';
import { LikedSongsSourceProcessor } from '../models/nodes/sources/liked-songs-source-processor';
import { LocalTracksSourceProcessor } from '../models/nodes/sources/local-tracks-source-processor';

export function getDataForNodeType(nodeType: CustomNodeType): any {
    switch (nodeType) {
        default:
            return {};
    }
}

export async function executeWorkflow(
    nodes: Node[],
    edges: Edge[],
): Promise<void> {
    console.log('Executing workflow with nodes:', nodes);

    const results = nodes.filter(
        (node) => (node.type as CustomNodeType) === 'result',
    );

    if (results.length === 0) {
        Spicetify.showNotification('No result node found in workflow', true);
        return;
    }

    if (results.length > 1) {
        Spicetify.showNotification(
            'The workflow should have only one result node',
            true,
        );
        return;
    }

    const result = results[0];

    console.log('Result node:', result);

    // Build the graph starting from the result node
    const nodesToVisit: Node[] = [...getIncomers(result, nodes, edges)];
    const resultProcessor = new ResultNodeProcessor(nodesToVisit[0].id);
    const allProcessors: Record<string, NodeProcessor> = {
        [result.id]: resultProcessor,
    };
    const visitedNodes: Set<string> = new Set<string>([result.id]);

    while (nodesToVisit.length > 0) {
        const currentNode = nodesToVisit.pop()!;

        if (visitedNodes.has(currentNode.id)) {
            Spicetify.showNotification('Cycle detected in workflow', true);
            return;
        }

        visitedNodes.add(currentNode.id);

        const incomers = getIncomers(currentNode, nodes, edges);
        allProcessors[currentNode.id] = getProcessorForNode(
            currentNode,
            incomers,
        );

        nodesToVisit.push(...incomers);
    }

    console.log('All processors : ', allProcessors);
    const finalResult = await resultProcessor.getResults(allProcessors);
    console.log('Final result : ', finalResult);
}

function getProcessorForNode(node: Node, incomers: Node[]): NodeProcessor {
    switch (node.type as CustomNodeType) {
        case 'likedSongsSource':
            return new LikedSongsSourceProcessor(node.data);
        case 'localTracksSource':
            return new LocalTracksSourceProcessor(node.data);
        default:
            throw new Error(`Unknown node type: ${node.type}`);
    }
}
