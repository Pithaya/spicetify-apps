import { type Edge, getIncomers, type Node } from 'reactflow';
import { nodeDefaultValuesFactory } from '../models/mappings/node-default-values-mapping';
import { nodeProcessorFactory } from '../models/mappings/node-processor-factory';
import { resultNodeProcessorFactory } from '../models/mappings/result-node-processor-factory';
import type { BaseNodeData } from '../models/processors/base-node-processor';
import type { NodeProcessor } from '../models/processors/node-processor';
import useAppStore from '../stores/store';
import {
    type CustomNodeType,
    ResultNodes,
    type ResultNodeType,
} from '../types/node-types';

/**
 * Get the default form values for the specified node type.
 * @param type The node type.
 * @returns The default form values.
 */
export const getDefaultValueForNodeType = (
    type: CustomNodeType,
): BaseNodeData => {
    return nodeDefaultValuesFactory[type]();
};

/**
 * Returns incoming nodes for a specific handle.
 * @param node The current node.
 * @param handle The edge handle.
 * @param incomers All incoming nodes for this node.
 * @param edges The edges in the graph.
 * @returns The IDs of the incoming nodes for the specified handle.
 */
export const getIncomingNodeIdsForHandle = (
    node: Node,
    handle: string,
    incomers: Node[],
    edges: Edge[],
) => {
    const incomingEdges = edges.filter(
        (edge) => edge.target === node.id && edge.targetHandle === handle,
    );

    const incomersForHandle = incomers.filter((n) =>
        incomingEdges.some((edge) => edge.source === n.id),
    );

    return incomersForHandle.map((n) => n.id);
};

export async function executeWorkflow(
    nodes: Node[],
    edges: Edge[],
): Promise<void> {
    const {
        setResult,
        updateNodeData,
        nodeFormValidationCallbacks: validationCallbacks,
    } = useAppStore.getState();

    // Get the result node
    const resultNodes = nodes.filter((node) =>
        (ResultNodes as readonly string[]).includes(node.type ?? ''),
    );

    if (resultNodes.length === 0) {
        Spicetify.showNotification('No result node found in workflow', true);
        return;
    }

    if (resultNodes.length > 1) {
        Spicetify.showNotification(
            'The workflow should have only one result node',
            true,
        );
        return;
    }

    const resultNode = resultNodes[0];

    // Validate node data
    // TODO: Return details of validation failure from callback
    let valid = true;
    for (const callback of validationCallbacks.values()) {
        const validationResult = await callback();
        valid = valid && validationResult;
    }

    if (!valid) {
        Spicetify.showNotification('Some nodes are invalid', true);
        return;
    }

    // All is valid to start the workflow: reset the result
    setResult([]);

    // Build the graph starting from the result node
    const nodesToVisit: Node[] = getIncomers(resultNode, nodes, edges);

    const resultNodeType = resultNode.type as ResultNodeType;
    const resultProcessor = resultNodeProcessorFactory[resultNodeType](
        resultNode,
        nodesToVisit,
        edges,
    );

    const allProcessors: Record<string, NodeProcessor<BaseNodeData>> = {};
    const visitedNodes: Set<string> = new Set<string>([resultNode.id]);

    while (nodesToVisit.length > 0) {
        const currentNode = nodesToVisit.pop()!;

        if (visitedNodes.has(currentNode.id)) {
            // Skip already visited nodes
            continue;
        }

        visitedNodes.add(currentNode.id);

        const incomers = getIncomers(currentNode, nodes, edges);
        const nodeType: Exclude<CustomNodeType, ResultNodeType> | undefined =
            currentNode.type as Exclude<CustomNodeType, ResultNodeType>;

        allProcessors[currentNode.id] = nodeProcessorFactory[nodeType](
            currentNode,
            incomers,
            edges,
        );

        nodesToVisit.push(...incomers);
    }

    try {
        const finalResult = await resultProcessor.getResults(allProcessors);

        setResult(finalResult);

        await resultProcessor.executeResultAction(finalResult);
    } catch (e) {
        console.error('Error while executing workflow:', e);
        Spicetify.showNotification('Error while executing workflow', true);

        setResult([]);
        for (const node of nodes) {
            updateNodeData(node.id, { isExecuting: false });
        }
    }
}
