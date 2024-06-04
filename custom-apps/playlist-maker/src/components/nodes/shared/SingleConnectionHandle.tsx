import useAppStore, {
    type AppState,
} from 'custom-apps/playlist-maker/src/store/store';
import React, { useMemo } from 'react';
import {
    type Node,
    type Edge,
    getConnectedEdges,
    Handle,
    useNodeId,
    type HandleProps,
} from 'reactflow';

const selector = (s: AppState): { nodes: Node[]; edges: Edge[] } => ({
    nodes: s.nodes,
    edges: s.edges,
});

export function SingleConnectionHandle(
    props: Readonly<HandleProps & { style: React.CSSProperties }>,
): JSX.Element {
    const { nodes, edges } = useAppStore(selector);
    const nodeId = useNodeId();

    const isHandleConnectable = useMemo(() => {
        const node = nodes.find((n) => n.id === nodeId)!;
        const connectedEdges = getConnectedEdges([node], edges);

        return connectedEdges.length === 0;
    }, [edges, nodeId]);

    return <Handle {...props} isConnectable={isHandleConnectable}></Handle>;
}
