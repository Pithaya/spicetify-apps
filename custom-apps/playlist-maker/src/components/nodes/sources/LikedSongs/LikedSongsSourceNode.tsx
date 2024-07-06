import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import styles from '../LikedSongs/LikedSongsSourceNode.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useAppStore } from '../../../../store/store';
import { type LikedSongsData } from 'custom-apps/playlist-maker/src/models/nodes/sources/liked-songs-source-processor';
import { NodeHeader } from '../../shared/NodeHeader';
import { Node } from '../../shared/Node';
import { NodeContent } from '../../shared/NodeContent';
import { TextInput } from '../../../inputs/TextInput';
import { NumberInput } from '../../../inputs/NumberInput';

export function LikedSongsSourceNode(
    props: NodeProps<LikedSongsData>,
): JSX.Element {
    const updateNodeData = useAppStore((state) => state.updateNodeData);

    return (
        <Node isExecuting={props.data.isExecuting}>
            <NodeHeader
                label="Source"
                backgroundColor="cornflowerblue"
                textColor="black"
            />
            <NodeContent className={styles['node-content']}>
                <TextComponent paddingBottom="8px" weight="bold">
                    Liked songs
                </TextComponent>
                <label>
                    <Spicetify.ReactComponent.TooltipWrapper
                        label={'Search filter to apply'}
                        showDelay={100}
                    >
                        <TextComponent elementType="small">
                            Filter
                        </TextComponent>
                    </Spicetify.ReactComponent.TooltipWrapper>
                    <TextInput
                        placeholder="Search"
                        value={props.data.filter}
                        onChange={(value) => {
                            updateNodeData<LikedSongsData>(props.id, {
                                filter: value,
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
                    <NumberInput
                        placeholder="0"
                        value={props.data.offset}
                        onChange={(value) => {
                            updateNodeData<LikedSongsData>(props.id, {
                                offset: value,
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
                    <NumberInput
                        placeholder="0"
                        value={props.data.limit}
                        onChange={(value) => {
                            updateNodeData<LikedSongsData>(props.id, {
                                limit: value,
                            });
                        }}
                    />
                </label>
            </NodeContent>
            <Handle
                type="source"
                position={Position.Right}
                id="result"
                style={{ top: '40px' }}
            />
        </Node>
    );
}
