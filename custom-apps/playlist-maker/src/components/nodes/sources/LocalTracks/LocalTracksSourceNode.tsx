import React from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';
import styles from './LocalTracksSourceNode.module.scss';
import { TextComponent } from '@shared/components/ui/TextComponent/TextComponent';
import { useAppStore } from '../../../../store/store';
import { type LocalTracksData } from 'custom-apps/playlist-maker/src/models/nodes/sources/local-tracks-source-processor';
import { Node } from '../../shared/Node';
import { NodeHeader } from '../../shared/NodeHeader';
import { NodeContent } from '../../shared/NodeContent';

export function LocalTracksSourceNode(
    props: NodeProps<LocalTracksData>,
): JSX.Element {
    const updateNodeData = useAppStore((state) => state.updateNodeData);

    return (
        <Node>
            <NodeHeader
                label="Source"
                backgroundColor="cornflowerblue"
                textColor="black"
            />
            <NodeContent className={styles['node-content']}>
                <TextComponent paddingBottom="8px">Local tracks</TextComponent>
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
                            updateNodeData<LocalTracksData>(props.id, {
                                filter: e.target.value,
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