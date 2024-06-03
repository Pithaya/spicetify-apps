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

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'likedSongsSource',
        position: { x: 0, y: 0 },
        data: {},
    },
    {
        id: '2',
        type: 'result',
        position: { x: 0, y: 100 },
        data: {},
    },
];
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

let id = initialNodes.length;
const getId = (): string => (++id).toString();

export type AppState = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    addNode: (nodeType: string, position: XYPosition) => void;
};

export const useStore = create<AppState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
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
    addNode: (nodeType: string, position: XYPosition) => {
        const newNode = {
            id: getId(),
            type: nodeType,
            position,
            data: { label: `${nodeType} node` }, // TODO: getDataForNodeType(nodeType)
        };

        set({ nodes: get().nodes.concat(newNode) });
    },
}));

export default useStore;
