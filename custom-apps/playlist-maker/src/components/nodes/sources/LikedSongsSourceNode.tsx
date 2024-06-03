import React from 'react';
import { Handle, Position } from 'reactflow';
import globalStyles from '../../../css/app.module.scss';
import styles from './LikedSongsSourceNode.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';

export function LikedSongsSourceNode(): JSX.Element {
    return (
        <div className={globalStyles['node']}>
            <div className={styles['node-header']}>
                <TextComponent paddingBottom="4px" weight="bold">
                    Source
                </TextComponent>
            </div>
            <div className={styles['node-content']}>
                <TextComponent>Liked songs</TextComponent>
            </div>
            <Handle type="source" position={Position.Right} id="result" />
        </div>
    );
}
