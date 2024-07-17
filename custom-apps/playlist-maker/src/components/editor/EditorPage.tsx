import React, { useCallback, type DragEvent } from 'react';
import styles from './EditorPage.module.scss';
import ReactFlow, {
    Controls,
    MiniMap,
    Background,
    BackgroundVariant,
    type Connection,
    type Node,
    getOutgoers,
} from 'reactflow';
import { Sidenav } from '../sidebar/Sidebar';
import { type CustomNodeType, nodeTypes } from '../../models/nodes/node-types';
import { useAppStore, type AppState } from '../../stores/store';
import { useShallow } from 'zustand/react/shallow';
import { ConfirmNewDialog } from './dialogs/ConfirmNewDialog';
import { CenterPanel } from './panels/CenterPanel';
import { TopRightPanel } from './panels/TopRightPanel';
import { TopLeftPanel } from './panels/TopLeftPanel';
import { ConfirmLoadDialog } from './dialogs/ConfirmLoadDialog';
import { ConfirmDeleteDialog } from './dialogs/ConfirmDeleteDialog';

type State = Pick<
    AppState,
    | 'reactFlowInstance'
    | 'nodes'
    | 'edges'
    | 'onNodesChange'
    | 'onEdgesChange'
    | 'onConnect'
    | 'addNode'
    | 'setReactFlowInstance'
    | 'getNodes'
    | 'getEdges'
>;

const selector = (state: AppState): State => ({
    reactFlowInstance: state.reactFlowInstance,
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    addNode: state.addNode,
    setReactFlowInstance: state.setReactFlowInstance,
    getNodes: state.getNodes,
    getEdges: state.getEdges,
});

export function EditorPage(): JSX.Element {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        reactFlowInstance,
        setReactFlowInstance,
        getNodes,
        getEdges,
    }: State = useAppStore(useShallow(selector));

    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData(
                'application/reactflow',
            ) as CustomNodeType;

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            }) ?? { x: 0, y: 0 };

            addNode(type, position);
        },
        [reactFlowInstance, addNode],
    );

    const isValidConnection = useCallback(
        (connection: Connection): boolean => {
            const nodes = getNodes();
            const edges = getEdges();
            const target = nodes.find((node) => node.id === connection.target);

            if (target === undefined) {
                return false;
            }

            const hasCycle = (
                node: Node,
                visited = new Set<string>(),
            ): boolean => {
                if (visited.has(node.id)) {
                    return false;
                }

                visited.add(node.id);

                for (const outgoer of getOutgoers(node, nodes, edges)) {
                    if (outgoer.id === connection.source) {
                        return true;
                    }

                    if (hasCycle(outgoer, visited)) {
                        return true;
                    }
                }

                return false;
            };

            if (target.id === connection.source) {
                return false;
            }

            return !hasCycle(target);
        },
        [getNodes, getEdges],
    );

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['grid-container']}>
                    <div className={styles['padding']} />
                    <div className={styles['sidenav']}>
                        <Sidenav />
                    </div>
                    <div className={styles['main']}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            deleteKeyCode={['Backspace']}
                            nodeTypes={nodeTypes}
                            isValidConnection={isValidConnection}
                        >
                            <TopLeftPanel />
                            <CenterPanel />
                            <TopRightPanel />
                            <Controls />
                            <MiniMap />
                            <Background
                                variant={BackgroundVariant.Dots}
                                gap={12}
                                size={1}
                            />
                        </ReactFlow>
                    </div>
                </div>
            </div>
            <ConfirmNewDialog />
            <ConfirmLoadDialog />
            <ConfirmDeleteDialog />
        </>
    );
}
