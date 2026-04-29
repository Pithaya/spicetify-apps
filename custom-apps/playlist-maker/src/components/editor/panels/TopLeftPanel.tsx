import React from 'react';
import styles from './TopLeftPanel.module.scss';
import { Panel } from 'reactflow';
import { HelpButton } from '../../help/HelpButton';

export function TopLeftPanel(): JSX.Element {
    return (
        <Panel className={styles['panel']} position="top-left">
            <HelpButton />
        </Panel>
    );
}
