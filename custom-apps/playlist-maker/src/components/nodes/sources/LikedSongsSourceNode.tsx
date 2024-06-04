import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import globalStyles from '../../../css/app.module.scss';
import styles from './LikedSongsSourceNode.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useStore } from '../../../store/store';
import { type LikedSongsData } from 'custom-apps/playlist-maker/src/models/nodes/sources/liked-songs-source-processor';

export function LikedSongsSourceNode(
    props: NodeProps<LikedSongsData>,
): JSX.Element {
    const updateNodeData = useStore((state) => state.updateNodeData);

    return (
        <div className={globalStyles['node']}>
            <div className={styles['node-header']}>
                <TextComponent paddingBottom="4px" weight="bold">
                    Source
                </TextComponent>
            </div>
            <div className={styles['node-content']}>
                <TextComponent paddingBottom="8px">Liked songs</TextComponent>
                <label>
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={'Search filter to apply'}
                        showDelay={100}
                    >
                        <TextComponent elementType="small">
                            Filter
                        </TextComponent>
                    </Spicetify.ReactComponent.TooltipWrapper>
                    <input
                        type="text"
                        placeholder="Search"
                        value={props.data.filter}
                        onChange={(e) => {
                            updateNodeData<LikedSongsData>(props.id, {
                                filter: e.target.value,
                            });
                        }}
                    />
                </label>
                <label>
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={'Number of elements to skip'}
                        showDelay={100}
                    >
                        <TextComponent elementType="small">
                            Offset
                        </TextComponent>
                    </Spicetify.ReactComponent.TooltipWrapper>
                    <input
                        type="number"
                        placeholder="0"
                        value={props.data.offset}
                        onChange={(e) => {
                            updateNodeData<LikedSongsData>(props.id, {
                                offset: e.target.valueAsNumber,
                            });
                        }}
                    />
                </label>
                <label>
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={
                            'Number of elements to take. Leave empty to take all elements.'
                        }
                        showDelay={100}
                    >
                        <TextComponent elementType="small">Limit</TextComponent>
                    </Spicetify.ReactComponent.TooltipWrapper>
                    <input
                        type="number"
                        placeholder="0"
                        value={props.data.limit}
                        onChange={(e) => {
                            updateNodeData<LikedSongsData>(props.id, {
                                limit: e.target.valueAsNumber,
                            });
                        }}
                    />
                </label>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                id="result"
                style={{ top: '40px' }}
            />
        </div>
    );
}
