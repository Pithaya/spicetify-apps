import { create } from 'zustand';
import {
    type Connection,
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
    addEdge,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
    type XYPosition,
    type ReactFlowInstance,
} from 'reactflow';
import { getDataForNodeType } from '../utils/node-utils';
import { type CustomNodeType } from '../models/nodes/node-types';
import { type Track } from '../models/track';
import { v4 as uuidv4 } from 'uuid';
import type { SavedWorkflow } from '../utils/storage-utils';

let id = 0;
const getId = (): string => (++id).toString();

// TODO: keep track of input validation errors

function isMove(change: NodeChange): boolean {
    return change.type === 'position' && change.position !== undefined;
}

function isRemove(change: NodeChange | EdgeChange): boolean {
    return change.type === 'remove';
}

export type AppState = {
    reactFlowInstance: ReactFlowInstance | null;
    nodes: Node[];
    edges: Edge[];
    result: Track[];
    workflowId: string;
    workflowName: string;
    hasPendingChanges: boolean;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setReactFlowInstance: (instance: ReactFlowInstance) => void;
    addNode: (nodeType: CustomNodeType, position: XYPosition) => void;
    updateNodeData: <T>(nodeId: string, data: Partial<T>) => void;
    setResult: (tracks: Track[]) => void;
    setWorkflowName: (workflowName: string) => void;
    resetState: () => void;
    onWorkflowSaved: () => void;
    loadWorkflow: (workflow: SavedWorkflow) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
    reactFlowInstance: null,
    nodes: [],
    edges: [],
    result: [],
    workflowId: uuidv4(),
    workflowName: 'My workflow',
    hasPendingChanges: false,
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
    addNode: (nodeType: CustomNodeType, position: XYPosition) => {
        const newNode = {
            id: getId(),
            type: nodeType,
            position,
            data: getDataForNodeType(nodeType),
        };

        set({ nodes: get().nodes.concat(newNode), hasPendingChanges: true });
    },
    updateNodeData: <T>(nodeId: string, data: Partial<T>) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...data } };
                }

                return node;
            }),
            hasPendingChanges: true,
        });
    },
    setResult: (tracks: Track[]) => {
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
            nodes: workflow.nodes || [],
            edges: workflow.edges || [],
            hasPendingChanges: false,
            workflowId: workflow.id,
            workflowName: workflow.name,
        });
    },
}));

export default useAppStore;
