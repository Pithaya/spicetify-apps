import React, { useEffect, useCallback } from 'react';
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
    type NodeTypes,
} from 'reactflow';
import styles from './css/app.module.scss';

// Can't use `import 'reactflow/dist/style.css';` because of postcss2 issue
import '../../../node_modules/reactflow/dist/style.css';
import './css/reactflow.scss';
import { Sidenav } from './components/sidebar/Sidebar';
import { LikedSongsSourceNode } from './components/nodes/sources/LikedSongsSourceNode';
import { ResultNode } from './components/nodes/result/ResultNode';

const nodeTypes: NodeTypes = {
    likedSongsSource: LikedSongsSourceNode,
    result: ResultNode,
};

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

// TODO: https://reactflow.dev/examples/interaction/drag-and-drop

function App(): JSX.Element {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
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
