import useAppStore, {
    type AppState,
} from 'custom-apps/playlist-maker/src/stores/store';
import { executeWorkflow } from 'custom-apps/playlist-maker/src/utils/node-utils';
import { CirclePlay } from 'lucide-react';
import React from 'react';
import { Panel } from 'reactflow';
import { useShallow } from 'zustand/react/shallow';
import styles from './TopRightPanel.module.scss';

export function TopRightPanel(): JSX.Element {
    const {
        nodes,
        edges,
        anyExecuting,
    }: Pick<AppState, 'nodes' | 'edges' | 'anyExecuting'> = useAppStore(
        useShallow((state) => ({
            nodes: state.nodes,
            edges: state.edges,
            anyExecuting: state.anyExecuting,
        })),
    );

    return (
        <Panel className={styles['panel']} position="top-right">
            <Spicetify.ReactComponent.ButtonTertiary
                aria-label="Execute"
                onClick={async () => {
                    await executeWorkflow(nodes, edges);
                }}
                buttonSize="sm"
                disabled={anyExecuting}
            >
                <div className="flex items-center gap-2">
                    <CirclePlay size={20} />
                    <span>Execute</span>
                </div>
            </Spicetify.ReactComponent.ButtonTertiary>
        </Panel>
    );
}
