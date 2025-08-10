import { type Edge, getIncomers, type Node } from 'reactflow';
import {
    type BaseNodeData,
    type NodeProcessor,
} from '../models/nodes/node-processor';
import { type CustomNodeType, ResultNodes } from '../models/nodes/node-types';
import useAppStore from '../stores/store';
import {
    nodeDefautValuesFactory,
    nodeProcessorFactory,
} from './node-factories';

export const getDefaultValueForNodeType = (
    type: CustomNodeType,
): BaseNodeData => {
    return nodeDefautValuesFactory[type]();
};

export async function executeWorkflow(
    nodes: Node[],
    edges: Edge[],
): Promise<void> {
    // TODO : reset result on workflow start

    const setResult = useAppStore.getState().setResult;
    const updateNodeData = useAppStore.getState().updateNodeData;
    const validationCallbacks =
        useAppStore.getState().nodeFormValidationCallbacks;

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

    // Build the graph starting from the result node
    const nodesToVisit: Node[] = getIncomers(resultNode, nodes, edges);
    const resultProcessor = nodeProcessorFactory.result(
        resultNode,
        nodesToVisit,
        edges,
    );
    const allProcessors: Record<string, NodeProcessor<BaseNodeData>> = {
        [resultNode.id]: resultProcessor,
    };
    const visitedNodes: Set<string> = new Set<string>([resultNode.id]);

    while (nodesToVisit.length > 0) {
        const currentNode = nodesToVisit.pop()!;

        if (visitedNodes.has(currentNode.id)) {
            // Skip already visited nodes
            continue;
        }

        visitedNodes.add(currentNode.id);

        const incomers = getIncomers(currentNode, nodes, edges);
        const nodeType: CustomNodeType | undefined =
            currentNode.type as CustomNodeType;

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

        // TODO : switch on result node type to do action

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
