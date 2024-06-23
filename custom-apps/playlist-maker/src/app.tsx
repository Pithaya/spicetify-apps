import React, { useEffect, useCallback, type DragEvent, useState } from 'react';
import whatsNew from 'spcr-whats-new';
import { version } from '../package.json';
import { CHANGE_NOTES } from './change-notes';
import ReactFlow, {
    Controls,
    MiniMap,
    Background,
    BackgroundVariant,
    Panel,
    type ReactFlowInstance,
} from 'reactflow';
import styles from './css/app.module.scss';

// Can't use `import 'reactflow/dist/style.css';` because of postcss2 issue
import '../../../node_modules/reactflow/dist/style.css';
import './css/reactflow.scss';
import { Sidenav } from './components/sidebar/Sidebar';
import { type CustomNodeType, nodeTypes } from './models/nodes/node-types';

import { useAppStore, type AppState } from './store/store';
import { useShallow } from 'zustand/react/shallow';
import { executeWorkflow } from './utils/node-utils';
import { HelpButton } from './components/help/HelpButton';

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

function App(): JSX.Element {
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

    async function init(): Promise<void> {
        await whatsNew('playlist-maker', version, {
            title: `New in v${version}`,
            content: (
                <p>
                    <ul>
                        {CHANGE_NOTES.map((value) => {
                            return <li key={value}>{value}</li>;
                        })}
                    </ul>
                </p>
            ),
            isLarge: true,
        });
    }

    useEffect(() => {
        void init();
    }, []);

    return (
        <div className={styles['container']}>
            <div className={styles['grid-container']}>
                <div className={styles['padding']} />
                <div className={styles['sidenav']}>
                    <Sidenav />
                </div>
                <div className={styles['main']}>
                    <ReactFlow
                        fitView
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

export default App;
