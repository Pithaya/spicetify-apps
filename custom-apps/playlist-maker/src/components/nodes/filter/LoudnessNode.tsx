import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import {
    LoudnessDataSchema,
    MAX_LOUDNESS,
    MIN_LOUDNESS,
    type LoudnessData,
} from 'custom-apps/playlist-maker/src/models/nodes/filter/loudness-processor';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { SliderController } from '../../inputs/SliderController';
import { Node } from '../shared/Node';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';

export function LoudnessNode(
    props: Readonly<NodeProps<LoudnessData>>,
): JSX.Element {
    const { control, updateNodeField } = useNodeForm<LoudnessData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('loudness'),
        LoudnessDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <FilterNodeHeader />
            <NodeContent>
                <div
                    style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingBottom: '8px',
                    }}
                >
                    <NodeTitle
                        title="Loudness (dB)"
                        tooltip="The overall loudness of a track in decibels (dB). 
                        Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks."
                    />

                    <SliderController
                        control={control}
                        min={MIN_LOUDNESS}
                        max={MAX_LOUDNESS}
                        step={0.01}
                        onChange={(value) => {
                            updateNodeField({ range: value });
                        }}
                    />
                </div>
            </NodeContent>
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: '42px' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '42px' }}
            />
        </Node>
    );
}
