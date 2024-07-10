import React, { useCallback, type DragEvent, useState } from 'react';
import styles from './EditorPage.module.scss';
import ReactFlow, {
    Controls,
    MiniMap,
    Background,
    BackgroundVariant,
    Panel,
    type ReactFlowInstance,
} from 'reactflow';
import { Sidenav } from '../sidebar/Sidebar';
import { type CustomNodeType, nodeTypes } from '../../models/nodes/node-types';
import { executeWorkflow } from '../../utils/node-utils';
import { HelpButton } from '../help/HelpButton';
import { useAppStore, type AppState } from '../../store/store';
import { useShallow } from 'zustand/react/shallow';

type State = Pick<
    AppState,
    | 'nodes'
    | 'edges'
    | 'onNodesChange'
    | 'onEdgesChange'
    | 'onConnect'
    | 'addNode'
>;

const selector = (state: AppState): State => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    addNode: state.addNode,
});

export function EditorPage(): JSX.Element {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
    }: State = useAppStore(useShallow(selector));
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance | null>(null);

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

    return (
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
                    >
                        <Panel
                            className={styles['panel']}
                            position="top-center"
                        >
                            My playlist
                        </Panel>
                        <Panel className={styles['panel']} position="top-right">
                            <button
                                onClick={async () => {
                                    // TODO: Move this elsewhere
                                    await executeWorkflow(nodes, edges);
                                }}
                            >
                                Save
                            </button>
                        </Panel>
                        <Panel className={styles['panel']} position="top-left">
                            <HelpButton />
                        </Panel>
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
    );
}
