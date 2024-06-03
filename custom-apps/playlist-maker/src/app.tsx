import React, { useEffect, useCallback, type DragEvent, useState } from 'react';
import whatsNew from 'spcr-whats-new';
import { version } from '../package.json';
import { CHANGE_NOTES } from './change-notes';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    Controls,
    MiniMap,
    Background,
    BackgroundVariant,
    Panel,
    type Node,
    type Edge,
    type ReactFlowInstance,
    type XYPosition,
} from 'reactflow';
import styles from './css/app.module.scss';

// Can't use `import 'reactflow/dist/style.css';` because of postcss2 issue
import '../../../node_modules/reactflow/dist/style.css';
import './css/reactflow.scss';
import { Sidenav } from './components/sidebar/Sidebar';
import { nodeTypes } from './models/nodes/node-types';

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

let id = 0;
const getId = (): string => `node_${id++}`;

function App(): JSX.Element {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance | null>(null);

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => addEdge(params, eds));
        },
        [setEdges],
    );

    const addNode = useCallback((nodeType: string, position: XYPosition) => {
        const newNode = {
            id: getId(),
            type: nodeType,
            position,
            data: { label: `${nodeType} node` },
        };

        setNodes((nds) => nds.concat(newNode));
    }, []);

    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

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
        [reactFlowInstance],
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
                    <Sidenav
                        onNodeSelected={(nodeType) => {
                            addNode(nodeType, { x: 0, y: 0 });
                        }}
                    />
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
                            Save
                        </Panel>
                        <Panel className={styles['panel']} position="top-left">
                            Help
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
