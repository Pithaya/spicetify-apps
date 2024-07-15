import React from 'react';
import styles from './TopRightPanel.module.scss';
import { Panel } from 'reactflow';
import { executeWorkflow } from 'custom-apps/playlist-maker/src/utils/node-utils';
import useAppStore, {
    type AppState,
} from 'custom-apps/playlist-maker/src/stores/store';
import { useShallow } from 'zustand/react/shallow';
import { CirclePlay } from 'lucide-react';

export function TopRightPanel(): JSX.Element {
    const { nodes, edges }: Pick<AppState, 'nodes' | 'edges'> = useAppStore(
        useShallow((state) => ({
            nodes: state.nodes,
            edges: state.edges,
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
                iconLeading={() => <CirclePlay size={20} />}
            >
                Execute
            </Spicetify.ReactComponent.ButtonTertiary>
        </Panel>
    );
}
