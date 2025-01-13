import React from 'react';
import styles from './TopLeftPanel.module.scss';
import { Panel } from 'reactflow';
import { HelpButton } from '../../help/HelpButton';
import { SettingsButton } from '../../settings/SettingsButton';

export function TopLeftPanel(): JSX.Element {
    return (
        <Panel className={styles['panel']} position="top-left">
            <HelpButton />
            <div className={styles['divider-horizontal']} />
            <SettingsButton />
        </Panel>
    );
}
