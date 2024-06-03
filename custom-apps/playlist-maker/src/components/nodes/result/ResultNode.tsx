import React from 'react';
import { Handle, Position } from 'reactflow';
import globalStyles from '../../../css/app.module.scss';
import styles from './ResultNode.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

export function ResultNode(): JSX.Element {
    return (
        <div className={globalStyles['node']}>
            <div className={styles['node-header']}>
                <TextComponent paddingBottom="4px" weight="bold">
                    Result
                </TextComponent>
            </div>
            <div className={styles['node-content']}>
                <TextComponent>Final playlist</TextComponent>
            </div>
            <Handle type="target" position={Position.Left} id="input" />
        </div>
    );
}
