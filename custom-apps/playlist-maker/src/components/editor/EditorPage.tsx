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
import { CirclePlay, Save, Network, BadgePlus } from 'lucide-react';
import { SettingsButton } from '../settings/SettingsButton';
import { TextInput } from '../inputs/TextInput';

type State = Pick<
    AppState,
    | 'nodes'
    | 'edges'
    | 'workflowName'
    | 'onNodesChange'
    | 'onEdgesChange'
    | 'onConnect'
    | 'addNode'
    | 'setWorkflowName'
    | 'resetWorkflow'
>;

const selector = (state: AppState): State => ({
    nodes: state.nodes,
    edges: state.edges,
    workflowName: state.workflowName,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    addNode: state.addNode,
    setWorkflowName: state.setWorkflowName,
    resetWorkflow: state.resetWorkflow,
});

export function EditorPage(): JSX.Element {
    const {
        nodes,
        edges,
        workflowName,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        setWorkflowName,
        resetWorkflow,
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
                            className={
                                styles['panel'] + ' ' + styles['flex-row']
                            }
                            position="top-center"
                        >
                            <TextInput
                                className={styles['title-input']}
                                placeholder=""
                                value={workflowName}
                                onChange={(value) => {
                                    setWorkflowName(value);
                                }}
                            />
                            <Spicetify.ReactComponent.TooltipWrapper label="Save workflow">
                                <Spicetify.ReactComponent.ButtonTertiary
                                    onClick={() => {}}
                                    buttonSize="sm"
                                    iconOnly={() => <Save size={20} />}
                                />
                            </Spicetify.ReactComponent.TooltipWrapper>
                            <div className={styles['divider-vertical']} />
                            <Spicetify.ReactComponent.TooltipWrapper label="Manage workflows">
                                <Spicetify.ReactComponent.ButtonTertiary
                                    onClick={() => {}}
                                    buttonSize="sm"
                                    iconOnly={() => <Network size={20} />}
                                />
                            </Spicetify.ReactComponent.TooltipWrapper>
                            <Spicetify.ReactComponent.TooltipWrapper label="Create new">
                                <Spicetify.ReactComponent.ButtonTertiary
                                    onClick={() => {
                                        resetWorkflow();
                                    }}
                                    buttonSize="sm"
                                    iconOnly={() => <BadgePlus size={20} />}
                                />
                            </Spicetify.ReactComponent.TooltipWrapper>
                        </Panel>
                        <Panel className={styles['panel']} position="top-right">
                            <Spicetify.ReactComponent.ButtonTertiary
                                onClick={async () => {
                                    await executeWorkflow(nodes, edges);
                                }}
                                buttonSize="sm"
                                iconLeading={() => <CirclePlay size={20} />}
                            >
                                Execute
                            </Spicetify.ReactComponent.ButtonTertiary>
                        </Panel>
                        <Panel className={styles['panel']} position="top-left">
                            <HelpButton />
                            <div className={styles['divider-horizontal']} />
                            <SettingsButton />
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
