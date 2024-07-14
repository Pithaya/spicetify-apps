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
} from 'reactflow';
import { getDataForNodeType } from '../utils/node-utils';
import { type CustomNodeType } from '../models/nodes/node-types';
import { type Track } from '../models/track';

let id = 0;
const getId = (): string => (++id).toString();

// TODO: keep track of input validation errors

function isClick(change: NodeChange | EdgeChange): boolean {
    return (
        change.type === 'select' ||
        (change.type === 'position' && change.position === undefined)
    );
}

export type AppState = {
    nodes: Node[];
    edges: Edge[];
    result: Track[];
    workflowName: string;
    hasPendingChanges: boolean;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (nodeType: CustomNodeType, position: XYPosition) => void;
    updateNodeData: <T>(nodeId: string, data: Partial<T>) => void;
    setResult: (tracks: Track[]) => void;
    setWorkflowName: (workflowName: string) => void;
    resetWorkflow: () => void;
    saveWorkflow: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
    nodes: [],
    edges: [],
    result: [],
    workflowName: 'My workflow',
    hasPendingChanges: false,
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });

        if (changes.some((c) => !isClick(c))) {
            set({
                hasPendingChanges: true,
            });
        }
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });

        if (changes.some((c) => !isClick(c))) {
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
    setNodes: (nodes: Node[]) => {
        set({ nodes });
    },
    setEdges: (edges: Edge[]) => {
        set({ edges });
    },
    addNode: (nodeType: CustomNodeType, position: XYPosition) => {
        const newNode = {
            id: getId(),
            type: nodeType,
            position,
            data: getDataForNodeType(nodeType),
        };

        set({ nodes: get().nodes.concat(newNode) });
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
    resetWorkflow: () => {
        set({
            nodes: [],
            edges: [],
            result: [],
            workflowName: 'My workflow',
            hasPendingChanges: false,
        });
    },
    saveWorkflow: () => {
        // TODO: Save the workflow
        set({ hasPendingChanges: false });
    },
}));

export default useAppStore;
