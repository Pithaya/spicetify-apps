import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    type Connection,
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
    type OnConnect,
    type OnEdgesChange,
    type OnNodesChange,
    type ReactFlowInstance,
    type XYPosition,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import type { BaseNodeData } from '../models/processors/base-node-processor';
import { type CustomNodeType } from '../types/node-types';
import { type WorkflowTrack } from '../types/workflow-track';
import { getDefaultValueForNodeType } from '../utils/node-utils';
import type { SavedWorkflow } from '../utils/storage-utils';

function isMove(change: NodeChange): boolean {
    return change.type === 'position' && change.position !== undefined;
}

function isRemove(change: NodeChange | EdgeChange): boolean {
    return change.type === 'remove';
}

export type AppState = {
    reactFlowInstance: ReactFlowInstance | null;
    nodes: Node<BaseNodeData>[];
    edges: Edge[];
    result: WorkflowTrack[];
    workflowId: string;
    workflowName: string;
    hasPendingChanges: boolean;
    anyExecuting: boolean;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setReactFlowInstance: (instance: ReactFlowInstance) => void;
    addNode: (nodeType: CustomNodeType, position: XYPosition) => void;
    updateNodeData: <T>(nodeId: string, data: Partial<T>) => void;
    setResult: (tracks: WorkflowTrack[]) => void;
    setWorkflowName: (workflowName: string) => void;
    resetState: () => void;
    onWorkflowSaved: () => void;
    loadWorkflow: (workflow: SavedWorkflow) => void;
    nodeFormValidationCallbacks: Map<string, () => Promise<boolean>>;
    addValidationCallback: (
        nodeId: string,
        callback: () => Promise<boolean>,
    ) => void;
    removeValidationCallback: (nodeId: string) => void;
    getNodes: () => Node[];
    getEdges: () => Edge[];
};

export const useAppStore = create<AppState>((set, get) => ({
    reactFlowInstance: null,
    nodes: [],
    edges: [],
    result: [],
    workflowId: uuidv4(),
    workflowName: 'My workflow',
    hasPendingChanges: false,
    anyExecuting: false,
    setReactFlowInstance: (instance: ReactFlowInstance) => {
        set({ reactFlowInstance: instance });
    },
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });

        if (changes.some((c) => isMove(c) || isRemove(c))) {
            set({
                hasPendingChanges: true,
            });
        }
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });

        if (changes.some((c) => isRemove(c))) {
            set({
                hasPendingChanges: true,
            });
        }
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
            hasPendingChanges: true,
        });
    },
    addNode: <T>(nodeType: CustomNodeType, position: XYPosition) => {
        const newNode = {
            id: uuidv4(),
            type: nodeType,
            position,
            data: getDefaultValueForNodeType(nodeType) as Partial<T>,
        };

        set({ nodes: get().nodes.concat(newNode), hasPendingChanges: true });
    },
    updateNodeData: <T>(nodeId: string, data: Partial<T>) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...(node.data as T), ...data } };
                }

                return node;
            }),
            hasPendingChanges: true,
        });
        set({
            anyExecuting: get().nodes.some(
                (node) => node.data.isExecuting === true,
            ),
        });
    },
    setResult: (tracks: WorkflowTrack[]) => {
        set({ result: tracks });
    },
    setWorkflowName: (workflowName: string) => {
        set({ workflowName, hasPendingChanges: true });
    },
    resetState: () => {
        set({
            nodes: [],
            edges: [],
            result: [],
            workflowId: uuidv4(),
            workflowName: 'My workflow',
            hasPendingChanges: false,
        });
    },
    onWorkflowSaved: () => {
        set({ hasPendingChanges: false });
    },
    loadWorkflow: (workflow: SavedWorkflow) => {
        const { x = 0, y = 0, zoom = 1 } = workflow.viewport;
        get().reactFlowInstance?.setViewport({ x, y, zoom });
        set({
            nodes: workflow.nodes,
            edges: workflow.edges,
            hasPendingChanges: false,
            workflowId: workflow.id,
            workflowName: workflow.name,
        });
    },
    nodeFormValidationCallbacks: new Map(),
    addValidationCallback: (
        nodeId: string,
        callback: () => Promise<boolean>,
    ) => {
        set({
            nodeFormValidationCallbacks: new Map(
                get().nodeFormValidationCallbacks,
            ).set(nodeId, callback),
        });
    },
    removeValidationCallback: (nodeId: string) => {
        const callbacks = new Map(get().nodeFormValidationCallbacks);
        callbacks.delete(nodeId);
        set({ nodeFormValidationCallbacks: callbacks });
    },
    getNodes: () => get().nodes,
    getEdges: () => get().edges,
}));

export default useAppStore;
