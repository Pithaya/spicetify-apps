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

export type AppState = {
    nodes: Node[];
    edges: Edge[];
    result: Track[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (nodeType: CustomNodeType, position: XYPosition) => void;
    updateNodeData: <T>(nodeId: string, data: Partial<T>) => void;
    setResult: (tracks: Track[]) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
    nodes: [],
    edges: [],
    result: [],
    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
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
        });
    },
    setResult: (tracks: Track[]) => {
        set({ result: tracks });
    },
}));

export default useAppStore;
