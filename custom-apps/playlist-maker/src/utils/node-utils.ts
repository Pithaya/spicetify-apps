import { type Edge, getIncomers, type Node } from 'reactflow';
import { type CustomNodeType } from '../models/nodes/node-types';
import { ResultNodeProcessor } from '../models/nodes/results/result-node-processor';
import { type NodeProcessor } from '../models/nodes/node-processor';
import { LikedSongsSourceProcessor } from '../models/nodes/sources/liked-songs-source-processor';
import { LocalTracksSourceProcessor } from '../models/nodes/sources/local-tracks-source-processor';
import { DeduplicateProcessor } from '../models/nodes/processing/deduplicate-processor';
import { GenreProcessor } from '../models/nodes/filter/genre-processor';
import useAppStore from '../stores/store';
import { PlaylistSourceProcessor } from '../models/nodes/sources/my-playlists-source-processor';
import { ShuffleProcessor } from '../models/nodes/processing/shuffle-processor';

export async function executeWorkflow(
    nodes: Node[],
    edges: Edge[],
): Promise<void> {
    console.log('Executing workflow with nodes:', nodes);
    const setResult = useAppStore.getState().setResult;
    const updateNodeData = useAppStore.getState().updateNodeData;
    const validationCallbacks =
        useAppStore.getState().nodeFormValidationCallbacks;

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

    // Validate node data
    let valid = true;
    for (const callback of validationCallbacks.values()) {
        const validationResult = await callback();
        valid = valid && validationResult;
    }

    if (!valid) {
        Spicetify.showNotification('Some nodes are invalid', true);
        return;
    }

    // Build the graph starting from the result node
    const nodesToVisit: Node[] = [...getIncomers(result, nodes, edges)];
    const resultProcessor = new ResultNodeProcessor(
        result.id,
        nodesToVisit.map((node) => node.id),
        result.data,
    );
    const allProcessors: Record<string, NodeProcessor<any>> = {
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
    try {
        const finalResult = await resultProcessor.getResults(allProcessors);
        console.log('Final result : ', finalResult);

        setResult(finalResult);
        Spicetify.showNotification(
            'Workflow executed successfully',
            false,
            1000,
        );
    } catch (e) {
        console.error('Error while executing workflow:', e);
        Spicetify.showNotification('Error while executing workflow', true);

        setResult([]);
        for (const node of nodes) {
            updateNodeData(node.id, { isExecuting: false });
        }
    }
}

function getProcessorForNode(node: Node, incomers: Node[]): NodeProcessor<any> {
    switch (node.type as CustomNodeType) {
        case 'likedSongsSource':
            return new LikedSongsSourceProcessor(node.id, [], node.data);
        case 'localTracksSource':
            return new LocalTracksSourceProcessor(node.id, [], node.data);
        case 'libraryPlaylistSource':
            return new PlaylistSourceProcessor(node.id, [], node.data);
        case 'deduplicate':
            return new DeduplicateProcessor(
                node.id,
                incomers.map((node) => node.id),
                node.data,
            );
        case 'genre':
            return new GenreProcessor(
                node.id,
                incomers.map((node) => node.id),
                node.data,
            );
        case 'shuffle':
            return new ShuffleProcessor(
                node.id,
                incomers.map((node) => node.id),
                node.data,
            );
        default:
            throw new Error(`Unknown node type: ${node.type}`);
    }
}
