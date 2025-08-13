import React, { useCallback, type DragEvent } from 'react';
import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    getOutgoers,
    MiniMap,
    type Connection,
    type Node,
} from 'reactflow';
import { useShallow } from 'zustand/react/shallow';
import { nodeTypeToComponentMapping } from '../../models/mappings/node-type-to-component-mapping';
import { useAppStore, type AppState } from '../../stores/store';
import { type CustomNodeType } from '../../types/node-types';
import { Sidenav } from '../sidebar/Sidebar';
import { ConfirmDeleteDialog } from './dialogs/ConfirmDeleteDialog';
import { ConfirmLoadDialog } from './dialogs/ConfirmLoadDialog';
import { ConfirmNewDialog } from './dialogs/ConfirmNewDialog';
import styles from './EditorPage.module.scss';
import { CenterPanel } from './panels/CenterPanel';
import { TopLeftPanel } from './panels/TopLeftPanel';
import { TopRightPanel } from './panels/TopRightPanel';

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
            <div id="playlist-maker" className="app-container">
                <div
                    className={Spicetify.classnames(
                        styles['grid-container'],
                        'gap-panel h-full w-full',
                    )}
                >
                    <div
                        className={Spicetify.classnames(
                            styles['padding'],
                            'panel',
                        )}
                    />
                    <div
                        className={Spicetify.classnames(
                            styles['sidenav'],
                            'panel overflow-scroll !p-5',
                        )}
                    >
                        <Sidenav />
                    </div>
                    <div
                        className={Spicetify.classnames(
                            styles['main'],
                            'panel',
                        )}
                    >
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
                            nodeTypes={nodeTypeToComponentMapping}
                            isValidConnection={isValidConnection}
                            selectNodesOnDrag={false}
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
